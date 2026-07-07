import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateVehicleInspectionDto } from './dto/create-vehicle-inspection.dto';
import { UpdateVehicleInspectionDto } from './dto/update-vehicle-inspection.dto';
import { Repository } from 'typeorm';
import { Car } from '../car/entities/car.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleInspection } from './entities/vehicle-inspection.entity';
import { PageInputDto } from '../paging/page-input.dto';
import { FilterVehicleInspectionDto } from './dto/filter-vehicle-inspection.dto';
import { PageMetaDto } from '../paging/page-meta.dto';
import { PageDto } from '../paging/page.dto';

@Injectable()
export class VehicleInspectionService {
  constructor(
    @InjectRepository(VehicleInspection)
    private vehicleInspectionRepository: Repository<VehicleInspection>,
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) { }

  async create(createVehicleInspectionDto: CreateVehicleInspectionDto) {
    await this.validateCarAvailable(createVehicleInspectionDto.car_id);
    const overlapExists = await this.checkOverlapInspectionDate(
      createVehicleInspectionDto.car_id,
      createVehicleInspectionDto.inspection_issue_date,
      createVehicleInspectionDto.inspection_expiry_date,
    );
    if (overlapExists) {
      throw new BadRequestException('Thời gian đăng kiểm trùng lặp');
    }
    const vehicleInspection = this.vehicleInspectionRepository.create(createVehicleInspectionDto);
    const saved = await this.vehicleInspectionRepository.save(vehicleInspection);
    return saved;
  }

  async findAll(pageInputDto: PageInputDto, filterDto: FilterVehicleInspectionDto) {
    const queryBuilder = this.vehicleInspectionRepository.createQueryBuilder('vehicle_inspection')
      .innerJoinAndSelect('vehicle_inspection.car', 'car');

    const conditions: { condition: string; params: object }[] = [
      !!filterDto.registration_number && {
        condition: 'car.registrationNumber LIKE :registration_number',
        params: { registration_number: `%${filterDto.registration_number}%` },
      },
      filterDto.is_active != null && {
        condition: 'vehicle_inspection.is_active = :is_active',
        params: { is_active: filterDto.is_active },
      },
    ].filter(Boolean) as { condition: string; params: object }[];

    queryBuilder.where('vehicle_inspection.is_deleted = false AND car.isDeleted = false');
    conditions.forEach((item) => { queryBuilder.andWhere(item.condition, item.params); });
    const orderByColumn = filterDto.sort_by
      ? (filterDto.sort_by.startsWith('car.') ? filterDto.sort_by : `vehicle_inspection.${filterDto.sort_by}`)
      : "vehicle_inspection.vehicle_inspection_id";
    queryBuilder.orderBy(orderByColumn, filterDto.sort_direction || 'DESC');

    let entities: VehicleInspection[];
    let pageMetaDto: PageMetaDto;

    const validPaging = !!pageInputDto.page && !!pageInputDto.limit;

    if (validPaging) {
      const page = pageInputDto.page;
      const limit = pageInputDto.limit;
      queryBuilder.skip((page - 1) * limit).take(limit);
      const itemCount = await queryBuilder.getCount();
      const result = await queryBuilder.getRawAndEntities();
      entities = result.entities;
      pageMetaDto = new PageMetaDto(pageInputDto, itemCount);
    } else {
      const result = await queryBuilder.getRawAndEntities();
      entities = result.entities;
      pageMetaDto = new PageMetaDto(new PageInputDto(), entities.length);
    }

    return new PageDto(entities, pageMetaDto);
  }

  async findOne(id: number) {
    const existing = await this.vehicleInspectionRepository.findOne({
      relations: ['car'],
      where: {
        vehicle_inspection_id: id,
        is_deleted: false,
      },
    });

    if (!existing) {
      throw new BadRequestException('Không tìm thấy đăng kiểm');
    }

    if (existing.car.isDeleted) {
      throw new BadRequestException('Không tìm thấy xe hoặc xe đã bị xóa');
    }
    return existing;
  }

  async update(id: number, updateVehicleInspectionDto: UpdateVehicleInspectionDto) {
    const existing = await this.findOne(id);
    await this.validateCarAvailable(existing.car_id);

    const overlapExists = await this.checkOverlapInspectionDate(
      updateVehicleInspectionDto.car_id ?? existing.car_id,
      updateVehicleInspectionDto.inspection_issue_date ?? existing.inspection_issue_date,
      updateVehicleInspectionDto.inspection_expiry_date ?? existing.inspection_expiry_date,
      id,
    );
    
    if (overlapExists) {
      throw new BadRequestException('Thời gian đăng kiểm trùng lặp');
    }

    const finalIssueDate = updateVehicleInspectionDto.inspection_issue_date ?? existing.inspection_issue_date;
    const finalExpiryDate = updateVehicleInspectionDto.inspection_expiry_date ?? existing.inspection_expiry_date;

    if (finalIssueDate && finalExpiryDate && new Date(finalExpiryDate) < new Date(finalIssueDate)) {
      throw new BadRequestException('Ngày hết hạn đăng kiểm phải lớn hơn ngày cấp');
    }
    await this.vehicleInspectionRepository.update(id, updateVehicleInspectionDto);
    return this.findOne(id);
  }

  async delete(id: number) {
    const existing = await this.findOne(id);
    const inspectionCount = await this.vehicleInspectionRepository.count({
      where: {
        car_id: existing.car_id,
        is_deleted: false,
      },
    });
    if (inspectionCount === 1) {
      throw new BadRequestException('Không thể xóa đăng kiểm cuối cùng của xe');
    }
    await this.vehicleInspectionRepository.update(id, { is_deleted: true });
    return { message: 'Xóa đăng kiểm thành công' };
  }

  async validateCarAvailable(carId: number): Promise<void> {
    const car = await this.carRepository.findOne({
      where: { car_id: carId },
    });

    if (!car || car.isDeleted) {
      throw new BadRequestException('Không tìm thấy xe hoặc xe đã bị xóa.');
    }

    if (!car.isActive) {
      throw new BadRequestException('Xe đã ngưng hoạt động.');
    }
  }

  async checkOverlapInspectionDate(car_id: number, inspection_issue_date: Date, inspection_expiry_date: Date, exclude_id?: number){
    const overlapExists = this.vehicleInspectionRepository
      .createQueryBuilder('vi')
      .where('vi.car_id = :car_id', { car_id })
      .andWhere('vi.is_deleted = false')
      .andWhere('vi.inspection_issue_date < :inspection_expiry_date', { inspection_expiry_date })
      .andWhere('vi.inspection_expiry_date > :inspection_issue_date', { inspection_issue_date });

    if (exclude_id) {
      overlapExists.andWhere('vi.vehicle_inspection_id != :exclude_id', { exclude_id });
    }
    return overlapExists.getExists();
  }
}
