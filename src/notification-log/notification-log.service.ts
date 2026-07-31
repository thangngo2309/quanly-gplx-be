import { BadRequestException, Injectable } from '@nestjs/common';
import { SendStatus } from '../enum/send-status.enum';
import { RetryNotificationDto } from './dto/retry-notification.dto';
import { NotificationLog } from './entities/notification-log.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverLicense } from '../driver-license/entities/driver-license.entity';
import { ReferenceType } from '../enum/reference-type.enum';
import { EmailSendStatus } from '../enum/email-send-status.enum';
import { MailService } from '../email/email.service';
import { SendEmailJobData } from '../email/interface/send-email.interface';
import { PageInputDto } from '../paging/page-input.dto';
import { NotificationLogFilterDto } from './dto/filter-notification.dto';
import { PageDto } from '../paging/page.dto';
import { PageMetaDto } from '../paging/page-meta.dto';
import { CreateNotificationLogDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationLogService {
  constructor(
    @InjectRepository(NotificationLog)
    private readonly notificationLogRepository: Repository<NotificationLog>,
    @InjectRepository(DriverLicense)
    private readonly driverLicenseRepository: Repository<DriverLicense>,
    private readonly mailService: MailService,

  ) { }

  async retryNotification(driver_license_id: number, retryNotificationDto: RetryNotificationDto
  ) {
    const driverLicense = await this.driverLicenseRepository.findOne({
      where: { driver_license_id: driver_license_id, is_deleted: false, is_active: true },
      relations: ['user'],
    });
    if (!driverLicense) {
      throw new BadRequestException('Không tìm thấy giấy phép lái xe');
    }
    const latestLog = await this.notificationLogRepository.findOne({
      where: {
        reference_type: ReferenceType.DRIVER_LICENSE,
        reference_id: driver_license_id,
        notification_type: retryNotificationDto.notification_type,
      },
      order: { created_at: 'DESC' },
    });

    const newRetryCount = (latestLog?.retry_count ?? 0) + 1;

    try {
      const emailJobData: SendEmailJobData = { driverLicense };
      await this.mailService.sendMail(emailJobData);

      await this.driverLicenseRepository.update(
        { driver_license_id: driver_license_id },
        { email_send_status: EmailSendStatus.SUCCESS },
      );

      return this.notificationLogRepository.save({
        reference_type: ReferenceType.DRIVER_LICENSE,
        reference_id: driverLicense.driver_license_id,
        notification_type: retryNotificationDto.notification_type,
        user_id: driverLicense.user.user_id,
        recipient: driverLicense.user.email,
        send_status: SendStatus.SUCCESS,
        retry_count: newRetryCount,
        sent_at: new Date(),
      });
    } catch (error) {
      return this.notificationLogRepository.save({
        reference_type: ReferenceType.DRIVER_LICENSE,
        reference_id: driverLicense.driver_license_id,
        notification_type: retryNotificationDto.notification_type,
        user_id: driverLicense.user.user_id,
        recipient: driverLicense.user.email,
        send_status: SendStatus.FAILED,
        retry_count: newRetryCount,
        error_message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  async findAll(pageInputDto: PageInputDto, filterDto: NotificationLogFilterDto) {
    const queryBuilder = this.notificationLogRepository
      .createQueryBuilder('notification_log')
      .innerJoinAndSelect('notification_log.user', 'u');

    const conditions: { condition: string; params: object }[] = [
      !!filterDto.reference_type && {
        condition: 'notification_log.reference_type = :reference_type',
        params: { reference_type: filterDto.reference_type },
      },
      !!filterDto.notification_type && {
        condition: 'notification_log.notification_type = :notification_type',
        params: { notification_type: filterDto.notification_type },
      },
      !!filterDto.send_status && {
        condition: 'notification_log.send_status = :send_status',
        params: { send_status: filterDto.send_status },
      },
      !!filterDto.recipient && {
        condition: 'notification_log.recipient LIKE :recipient',
        params: { recipient: `%${filterDto.recipient}%` },
      },
      !!filterDto.fullname && {
        condition: 'u.fullname LIKE :fullname',
        params: { fullname: `%${filterDto.fullname}%` },
      },
    ].filter(Boolean) as { condition: string; params: object }[];

    conditions.forEach((item) => { queryBuilder.andWhere(item.condition, item.params); });

    queryBuilder.orderBy('notification_log.created_at', 'DESC');

    let entities: NotificationLog[];
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

  async create(createNotificationLogDto: CreateNotificationLogDto) {
    const notificationLog = this.notificationLogRepository.create(createNotificationLogDto);
    return this.notificationLogRepository.save(notificationLog);
  }

  async findOne(id: number) {
    const existing = await this.notificationLogRepository.findOne({ where: { notification_log_id: id } });
    if (!existing) {
      throw new BadRequestException(`Không tìm thấy notification log với id ${id}`);
    }
    return this.notificationLogRepository.findOne({ where: { notification_log_id: id } });
  }

  async update(id: number, updateNotificationLogDto: Partial<NotificationLog>) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new BadRequestException(`Không tìm thấy notification log với id ${id}`);
    }
    await this.notificationLogRepository.update({ notification_log_id: id }, updateNotificationLogDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new BadRequestException(`Không tìm thấy notification log với id ${id}`);
    }
    return this.notificationLogRepository.delete({ notification_log_id: id });
  }
}
