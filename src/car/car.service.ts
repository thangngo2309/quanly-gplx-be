import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from '../paging/page.dto';
import { PageMetaDto } from '../paging/page-meta.dto';
import { PageInputDto } from '../paging/page-input.dto';
import { DeleteMultiCarDto } from './dto/delete-multi-car.dto';
import { UpdateMultiCarDto } from './dto/update-multi-car.dto';
import { CarFilterDto } from './dto/filter-car.dto';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) { }

  async create(createCarDto: CreateCarDto) {
    await this.checkuniquefield(createCarDto);

    const car = this.carRepository.create(createCarDto);
    return this.carRepository.save(car);
  }

  async findAll(pageInputDto: PageInputDto, filterDto: CarFilterDto) {
    const queryBuilder = this.carRepository.createQueryBuilder('car');

    const conditions: { condition: string; params: object }[] = [
      !!filterDto.registrationNumber && {
        condition: 'car.registrationNumber LIKE :registrationNumber',
        params: { registrationNumber: `%${filterDto.registrationNumber}%` },
      },
      !!filterDto.imeiDat && {
        condition: 'car.imeiDat LIKE :imeiDat',
        params: { imeiDat: `%${filterDto.imeiDat}%` },
      },
      typeof filterDto.active === 'boolean' && {
        condition: 'car.isActive = :active',
        params: { active: filterDto.active },
      }
    ].filter(Boolean) as { condition: string; params: object }[];

    queryBuilder.where(
      'car.isDeleted = false'
    );
    conditions.forEach((item) => {
      queryBuilder.andWhere(
        item.condition,
        item.params
      );
    });
    queryBuilder.orderBy(`car.${filterDto.sortBy}` || 'car.car_id', filterDto.sortDirection || 'ASC');

    let entities: Car[];
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
    const existing = await this.carRepository.findOne({ where: { car_id: id, isDeleted: false } });
    if (!existing) {
      throw new BadRequestException('Không tìm thấy xe');
    }
    return existing;
  }

  async update(id: number, updateCarDto: UpdateCarDto) {
    const existing = await this.carRepository.findOne({ where: { car_id: id, isDeleted: false } });

    if (!existing) {
      throw new BadRequestException('Không tìm thấy xe');
    }

    await this.checkuniquefield(updateCarDto, id);

    const finalLicenseIssueDate = updateCarDto.practiceVehicleLicenseIssueDate ?? existing.practiceVehicleLicenseIssueDate;
    const finalLicenseExpiryDate = updateCarDto.practiceVehicleLicenseExpiryDate ?? existing.practiceVehicleLicenseExpiryDate;

    if (new Date(finalLicenseIssueDate) > new Date(finalLicenseExpiryDate)) {
      throw new BadRequestException('Ngày hết hạn giấy phép xe tập lái phải lớn hơn ngày cấp');
    }

    const finalInspectionIssueDate = updateCarDto.inspectionIssueDate ?? existing.inspectionIssueDate;
    const finalInspectionExpiryDate = updateCarDto.inspectionExpiryDate ?? existing.inspectionExpiryDate;

    if (new Date(finalInspectionIssueDate) > new Date(finalInspectionExpiryDate)) {
      throw new BadRequestException('Ngày hết hạn đăng kiểm phải lớn hơn ngày cấp');
    }
    await this.carRepository.update(id, updateCarDto);
    return this.carRepository.findOne({ where: { car_id: id, isDeleted: false } });
  }

  async remove(id: number) {
    const existing = await this.carRepository.findOne({ where: { car_id: id, isDeleted: false } });

    if (!existing) {
      throw new BadRequestException('Không tìm thấy xe');
    }

    existing.isDeleted = true;
    await this.carRepository.save(existing);
    return { message: 'Xe đã được xóa' };
  }

  async checkuniquefield(dto: CreateCarDto | UpdateCarDto, id?: number) {
    const fields: string[] = ['imeiDat', 'serialNumber', 'registrationNumber'];
    for (const field of fields) {
      if (dto[field]) {
        const existing = await this.carRepository.findOne({
          where: {
            [field]: dto[field],
            isDeleted: false,
            ...(id ? { car_id: Not(id) } : {})
          }
        });
        if (existing) {
          throw new BadRequestException(`Giá trị ${field} đã tồn tại`);
        }
      }
    }
  }

  async deleteMulti(deleteCarDto: DeleteMultiCarDto) {
    const existing = await this.carRepository.find({
      where: {
        car_id: In(deleteCarDto.car_ids)
      }
    });

    const existingIds = existing.map(car => Number(car.car_id));
    const notFoundIds = deleteCarDto.car_ids
      .map(id => Number(id))
      .filter(id => !existingIds.includes(id));

    if (existingIds.length > 0) {
      await this.carRepository.update(
        { car_id: In(existingIds) },
        { isDeleted: true },
      );
    }

    return {
      deletedIds: existingIds,
      missingIds: notFoundIds,
    };
  }

  async updateMultiple(multiCarDto: UpdateMultiCarDto) {
    const existingCars = await this.findMany(multiCarDto.car_ids);

    const updatedIds = existingCars.map(car => Number(car.car_id));
    const notFoundIds = multiCarDto.car_ids
      .map(id => Number(id)).filter(id => !updatedIds.includes(id));

    const errors: string[] = [];
    const validCarIds: number[] = [];

    for (const existingCar of existingCars) {
      const final_inspection_issue_date = multiCarDto.data.inspectionIssueDate || existingCar.inspectionIssueDate;
      const final_inspection_expiry_date = multiCarDto.data.inspectionExpiryDate || existingCar.inspectionExpiryDate;
      const final_practice_vehicle_license_issue_date = multiCarDto.data.practiceVehicleLicenseIssueDate || existingCar.practiceVehicleLicenseIssueDate;
      const final_practice_vehicle_license_expiry_date = multiCarDto.data.practiceVehicleLicenseExpiryDate || existingCar.practiceVehicleLicenseExpiryDate;

      let hasError = false;

      if (new Date(final_practice_vehicle_license_issue_date) > new Date(final_practice_vehicle_license_expiry_date)) {
        errors.push(`Xe ${existingCar.registrationNumber}: Ngày hết hạn giấy phép xe tập lái phải lớn hơn ngày cấp`);
        hasError = true;
      }

      if (new Date(final_inspection_issue_date) > new Date(final_inspection_expiry_date)) {
        errors.push(`Xe ${existingCar.registrationNumber}: Ngày hết hạn đăng kiểm phải lớn hơn ngày cấp`);
        hasError = true;
      }

      if (!hasError) {
        validCarIds.push(Number(existingCar.car_id));
      }
    }

    if (validCarIds.length > 0) {
      await this.carRepository.update(
        { car_id: In(validCarIds) },
        multiCarDto.data
      );
    }

    return {
      updatedCar: validCarIds.length > 0 ? await this.findMany(validCarIds) : [],
      missingIds: notFoundIds,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  private async findMany(ids: number[]): Promise<Car[]> {
    return this.carRepository.find({
      where: {
        car_id: In(ids),
        isDeleted: false
      }
    });
  }

  async uniqueRegistrationNumber(registrationNumber: string, id?: number): Promise<{ isUnique: boolean }> {
    const existing = await this.carRepository.findOne({
      where: {
        registrationNumber,
        isDeleted: false,
        ...(id ? { car_id: Not(id) } : {})
      }
    });
    return { isUnique: !existing };
  }

    async uniqueImeiDat(imeiDat: string, id?: number): Promise<{ isUnique: boolean }> {
    const existing = await this.carRepository.findOne({
      where: {
        imeiDat,
        isDeleted: false,
        ...(id ? { car_id: Not(id) } : {})
      }
    });
    return { isUnique: !existing };
  }

    async uniqueSerialNumber(serialNumber: string, id?: number): Promise<{ isUnique: boolean }> {
    const existing = await this.carRepository.findOne({
      where: {
        serialNumber,
        isDeleted: false,
        ...(id ? { car_id: Not(id) } : {})
      }
    });
    return { isUnique: !existing };
  }
}
