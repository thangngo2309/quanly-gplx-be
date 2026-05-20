import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from '../paging/page.dto';
import { PageMetaDto } from '../paging/page-meta.dto';
import { PageInputDto } from '../paging/page-input.dto';

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

  async findAll(pageInputDto: PageInputDto): Promise<PageDto<Car>> {
    const queryBuilder = this.carRepository.createQueryBuilder('car');

    queryBuilder
      .where('car.isDeleted = false')
      .orderBy('car.car_id', pageInputDto.orderBy)
      .skip(pageInputDto.skip)
      .take(pageInputDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto(pageInputDto, itemCount);

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

  private async checkuniquefield(dto: CreateCarDto | UpdateCarDto, id?: number) {
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
}
