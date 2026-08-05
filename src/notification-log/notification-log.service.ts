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

    if (driverLicense.email_send_status !== EmailSendStatus.FAILED) {
      throw new BadRequestException('Chỉ có thể gửi lại các thông báo ở trạng thái FAILED.');
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
    const latestSubQuery = this.notificationLogRepository
      .createQueryBuilder('nl')
      .select('nl.reference_type', 'reference_type')
      .addSelect('nl.reference_id', 'reference_id')
      .addSelect('MAX(nl.notification_log_id)', 'max_failed_id')
      .where('nl.send_status = :failedStatus', { failedStatus: SendStatus.FAILED })
      .groupBy('nl.reference_type')
      .addGroupBy('nl.reference_id');

    const queryBuilder = this.notificationLogRepository
      .createQueryBuilder('notification_log')
      .innerJoinAndSelect('notification_log.user', 'u')
      .leftJoin(
        `(${latestSubQuery.getQuery()})`, 'latest',
        `
        latest.reference_type = notification_log.reference_type
        AND latest.reference_id = notification_log.reference_id
        `,
      )
      .leftJoin(
        'driver_licenses', 'dl',
        'dl.driver_license_id = notification_log.reference_id AND notification_log.reference_type = :driverLicenseType',
      )
      .addSelect(`
        CASE 
          WHEN notification_log.reference_type = :driverLicenseType THEN dl.expiry_date::text 
        END
      `, 'expiry_date')
      .addSelect(`
        latest.max_failed_id = notification_log.notification_log_id
        AND CASE 
          WHEN notification_log.reference_type = :driverLicenseType THEN  dl.email_send_status = :emailFailedStatus
        END
      `, 'can_retry')
      .where(`
        notification_log.send_status != :failedStatus
        OR latest.max_failed_id = notification_log.notification_log_id
      `)
      .setParameters({
        ...latestSubQuery.getParameters(),
        failedStatus: SendStatus.FAILED,
        emailFailedStatus: EmailSendStatus.FAILED,
        driverLicenseType: ReferenceType.DRIVER_LICENSE,
      });

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
      entities = result.entities.map((entity, index) => ({
        ...entity,
        expiry_date: result.raw[index]?.expiry_date ?? null,
        can_retry: result.raw[index]?.can_retry ?? false,
      }));
      pageMetaDto = new PageMetaDto(pageInputDto, itemCount);
    } else {
      const result = await queryBuilder.getRawAndEntities();
      entities = result.entities.map((entity, index) => ({
        ...entity,
        expiry_date: result.raw[index]?.expiry_date ?? null,
        can_retry: result.raw[index]?.can_retry ?? false,
      }));
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
