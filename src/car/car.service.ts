import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { Repository } from 'typeorm';
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
    const existing = await this.carRepository.findOne({
      where: {
        registrationNumber: createCarDto.registrationNumber,
        isDeleted: false
      }
    });

    if (existing) {
      throw new BadRequestException('Xe đã tồn tại');
    }

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
    const itemTotalCount = await this.carRepository.count({
      where: { isDeleted: false }
    });
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto(pageInputDto, itemCount, itemTotalCount);

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
}
