import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDriverLicenseDto } from './dto/create-driver-license.dto';
import { UpdateDriverLicenseDto } from './dto/update-driver-license.dto';
import { In, Not, Repository } from 'typeorm';
import { DriverLicense } from './entities/driver-license.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInputDto } from '../paging/page-input.dto';
import { DriverLicenseFilterDto } from './dto/filter-driver-license.dto';
import { PageMetaDto } from '../paging/page-meta.dto';
import { PageDto } from '../paging/page.dto';
import { DeleteMultiDriverLicenseDto } from './dto/delete-multi-driver-license.dto';
import { UpdateMultiDriverLicenseDto } from './dto/update-multi-driver-license.dto';
import { User } from '../user/entities/user.entity';
import { Settings } from '../settings/entities/setting.entity';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { expiryReminderSetting } from '../constant/setting.constant';

@Injectable()
export class DriverLicenseService {
  constructor(
    @InjectRepository(DriverLicense)
    private driverLicenseRepository: Repository<DriverLicense>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
    @InjectQueue('send-email')
    private readonly emailQueue: Queue,
  ) { }

  async create(createDriverLicenseDto: CreateDriverLicenseDto) {
    await this.checkuniquefield(createDriverLicenseDto);
    const isUserValid = await this.checkUserValid(createDriverLicenseDto.user_id);
    if (!isUserValid) {
      throw new BadRequestException(`Không thể tạo GPLX cho người dùng đã ngưng hoạt động hoặc đã bị xóa.`);
    }

    const driverLicense = this.driverLicenseRepository.create(createDriverLicenseDto);
    return this.driverLicenseRepository.save(driverLicense);
  }

  async findAll(pageInputDto: PageInputDto, filterDto: DriverLicenseFilterDto) {
    const queryBuilder = this.driverLicenseRepository.createQueryBuilder('driver_license')
      .innerJoinAndSelect('driver_license.user', 'u');

    const conditions: { condition: string; params: object }[] = [
      !!filterDto.license_number && {
        condition: 'driver_license.license_number LIKE :license_number',
        params: { license_number: `%${filterDto.license_number}%` },
      },
      !!filterDto.fullname && {
        condition: 'u.fullname LIKE :fullname',
        params: { fullname: `%${filterDto.fullname}%` },
      },
      filterDto.active != null && {
        condition: 'driver_license.is_active = :is_active',
        params: { is_active: filterDto.active },
      },
    ].filter(Boolean) as { condition: string; params: object }[];

    queryBuilder.where('driver_license.is_deleted = false AND u.is_deleted = false');
    conditions.forEach((item) => { queryBuilder.andWhere(item.condition, item.params); });
    const orderByColumn = filterDto.sortBy
      ? (filterDto.sortBy.startsWith('u.') ? filterDto.sortBy : `driver_license.${filterDto.sortBy}`)
      : "driver_license.driver_license_id";
    queryBuilder.orderBy(orderByColumn, filterDto.sortDirection || 'DESC');

    let entities: DriverLicense[];
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
    const existing = await this.driverLicenseRepository.findOne({
      relations: ['user'],
      where: { driver_license_id: id, is_deleted: false },
    });

    if (!existing) {
      throw new BadRequestException(`Không tìm thấy giấy phép lái xe`);
    }

    if (existing.user.is_deleted) {
      throw new BadRequestException(`Không thể truy xuất GPLX của người dùng đã bị xóa.`);
    }

    return existing;
  }

  private async findOneById(id: number) {
    const existing = await this.driverLicenseRepository.findOne({
      relations: ['user'],
      where: {
        driver_license_id: id,
        is_deleted: false,
      },
    });

    if (!existing) {
      throw new BadRequestException(`Không tìm thấy giấy phép lái xe`);
    }

    if (!existing.user.is_active || existing.user.is_deleted) {
      throw new BadRequestException(
        `Không thể cập nhật GPLX của người dùng đã ngưng hoạt động hoặc đã bị xóa.`,
      );
    }

    return existing;
  }

  async update(id: number, updateDriverLicenseDto: UpdateDriverLicenseDto) {
    const existing = await this.findOneById(id);
    await this.checkuniquefield(updateDriverLicenseDto, id);

    if (updateDriverLicenseDto.user_id) {
      const isUserValid = await this.checkUserValid(updateDriverLicenseDto.user_id);
      if (!isUserValid) {
        throw new BadRequestException('Không thể cập nhật GPLX này sang người dùng đã ngưng hoạt động hoặc đã bị xóa.');
      }
    }

    const finalIssueDate = updateDriverLicenseDto.issue_date ?? existing.issue_date;
    const finalExpiryDate = updateDriverLicenseDto.expiry_date ?? existing.expiry_date;
    const finalPassDate = updateDriverLicenseDto.pass_date ?? existing.pass_date;

    if (finalIssueDate && finalExpiryDate && new Date(finalIssueDate) > new Date(finalExpiryDate)) {
      throw new BadRequestException('Ngày hết hạn giấy phép lái xe phải lớn hơn ngày cấp');
    }

    if (finalPassDate && finalIssueDate && new Date(finalPassDate) > new Date(finalIssueDate)) {
      throw new BadRequestException('Ngày trúng tuyển phải nhỏ hơn hoặc bằng ngày cấp giấy phép lái xe');
    }

    await this.driverLicenseRepository.update(id, updateDriverLicenseDto);
    return this.findOne(id);
  }

  async updateMultiple(multipleDriverLicenseDto: UpdateMultiDriverLicenseDto) {
    const existing = await this.findMany(multipleDriverLicenseDto.driver_license_ids);
    const updatedIds = existing.map(driver_license => Number(driver_license.driver_license_id));
    const notFoundIds = multipleDriverLicenseDto.driver_license_ids
      .map(id => Number(id)).filter(id => !updatedIds.includes(id));

    const errors: string[] = [];
    const validDriverLicenseIds: number[] = [];

    for (const driver_license of existing) {
      const final_issue_date = multipleDriverLicenseDto.data.issue_date || driver_license.issue_date;
      const final_expiry_date = multipleDriverLicenseDto.data.expiry_date || driver_license.expiry_date;
      const final_pass_date = multipleDriverLicenseDto.data.pass_date || driver_license.pass_date;

      let hasError = false;

      if (final_issue_date && final_expiry_date && new Date(final_issue_date) > new Date(final_expiry_date)) {
        errors.push(`Giấy phép lái xe ${driver_license.license_number}: Ngày hết hạn giấy phép lái xe phải lớn hơn ngày cấp`);
        hasError = true;
      }
      if (final_pass_date && final_issue_date && new Date(final_pass_date) > new Date(final_issue_date)) {
        errors.push(`Giấy phép lái xe ${driver_license.license_number}: Ngày trúng tuyển phải nhỏ hơn hoặc bằng ngày cấp giấy phép lái xe`);
        hasError = true;
      }

      if (driver_license.user_id) {
        const isUserValid = await this.checkUserValid(driver_license.user_id);
        if (!isUserValid) {
          errors.push(`Giấy phép lái xe ${driver_license.license_number}: Không thể cập nhật GPLX của người dùng đã ngưng hoạt động hoặc đã bị xóa.`);
          hasError = true;
        }
      }

      if (!hasError) {
        validDriverLicenseIds.push(driver_license.driver_license_id);
      }
    }

    if (validDriverLicenseIds.length > 0) {
      await this.driverLicenseRepository.update(
        { driver_license_id: In(validDriverLicenseIds) },
        multipleDriverLicenseDto.data
      );
    }

    return {
      updatedDriverLicense: validDriverLicenseIds.length > 0 ? await this.findMany(validDriverLicenseIds) : [],
      missingIds: notFoundIds,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    existing.is_deleted = true;
    await this.driverLicenseRepository.save(existing);
    return { message: 'Giấy phép lái xe đã được xóa' };
  }

  async deleteMulti(deleteDriverLicenseDto: DeleteMultiDriverLicenseDto) {
    const existing = await this.driverLicenseRepository.findBy({ driver_license_id: In(deleteDriverLicenseDto.driver_license_ids) });

    const existingIds = existing.map(driver_license => Number(driver_license.driver_license_id));
    const notFoundIds = deleteDriverLicenseDto.driver_license_ids
      .map(id => Number(id))
      .filter(id => !existingIds.includes(id));

    if (existingIds.length > 0) {
      await this.driverLicenseRepository.update(
        { driver_license_id: In(existingIds) },
        { is_deleted: true },
      );
    }

    return {
      deletedIds: existingIds,
      missingIds: notFoundIds,
    };
  }

  async checkUniqueDriverLicenseNumber(license_number: string, id?: number): Promise<{ isUnique: boolean }> {
    const existing = await this.driverLicenseRepository.findOne({
      where: {
        license_number,
        is_deleted: false,
        ...(id ? { driver_license_id: Not(id) } : {})
      }
    });
    return { isUnique: !existing };
  }

  async checkuniquefield(dto: CreateDriverLicenseDto | UpdateDriverLicenseDto, id?: number) {
    const fields: string[] = ['license_number'];
    for (const field of fields) {
      if (dto[field]) {
        const existing = await this.driverLicenseRepository.findOne({
          where: {
            [field]: dto[field],
            is_deleted: false,
            ...(id ? { driver_license_id: Not(id) } : {})
          }
        });
        if (existing) {
          throw new BadRequestException(`Giá trị ${field} đã tồn tại`);
        }
      }
    }
  }

  private async findMany(ids: number[]): Promise<DriverLicense[]> {
    return this.driverLicenseRepository.find({
      where: {
        driver_license_id: In(ids),
        is_deleted: false
      }
    });
  }

  async checkUserValid(user_id: number): Promise<boolean> {
    const existing = await this.userRepository.findOne(
      { where: { user_id, is_active: true, is_deleted: false } }
    );
    return !!existing;
  }

  async sendExpiryReminder() {
    const expiryReminderDaysBefore =
      await this.settingsRepository.findOne({
        where: { key: expiryReminderSetting, is_active: true, is_deleted: false },
      });

    if (!expiryReminderDaysBefore) {
      throw new BadRequestException(
        `Không tìm thấy setting ${expiryReminderSetting}`,
      );
    }

    const driverLicenses = await this.driverLicenseRepository
      .createQueryBuilder('dl')
      .innerJoinAndSelect('dl.user', 'u')
      .where(`dl.expiry_date <= CURRENT_DATE + ${Number(expiryReminderDaysBefore.value)}`)
      .andWhere('dl.expiry_date >= CURRENT_DATE')
      .andWhere('dl.is_deleted = false')
      .andWhere('dl.is_active = true')
      .andWhere('u.is_deleted = false')
      .andWhere('u.is_active = true')
      .getMany();

    for (const item of driverLicenses) {
      await this.emailQueue.add(
        'send-email',
        {
          driverLicense: item,
        },
        {
          attempts: 3,
          removeOnComplete: true,
        },
      );
    }
  }
}
