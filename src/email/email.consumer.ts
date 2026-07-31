import { Processor, Process, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { MailService } from './email.service';
import { SendEmailJobData } from './interface/send-email.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverLicense } from '../driver-license/entities/driver-license.entity';
import { Repository } from 'typeorm';
import { EmailSendStatus } from '../enum/email-send-status.enum';
import { NotificationLog } from '../notification-log/entities/notification-log.entity';
import { NotificationType } from '../enum/notification-type.enum';
import { ReferenceType } from '../enum/reference-type.enum';
import { SendStatus } from '../enum/send-status.enum';

@Processor('send-email')
export class EmailConsumer {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(DriverLicense)
    private driverLicenseRepository: Repository<DriverLicense>,
    @InjectRepository(NotificationLog)
    private notificationLogRepository: Repository<NotificationLog>
  ) { }

  @Process('send-email')
  async handleSendEmail(
    job: Job<SendEmailJobData>,
  ) {
    try {
      await this.mailService.sendMail(job.data);
      await this.driverLicenseRepository.update(
        { driver_license_id: job.data.driverLicense.driver_license_id },
        { email_send_status: EmailSendStatus.SUCCESS },
      );
      await this.notificationLogRepository.save({
        reference_type: ReferenceType.DRIVER_LICENSE,
        reference_id: job.data.driverLicense.driver_license_id,
        notification_type: NotificationType.EMAIL,
        user_id: job.data.driverLicense.user.user_id,
        recipient: job.data.driverLicense.user.email,
        send_status: SendStatus.SUCCESS,
        sent_at: new Date(),
      });
    } catch (error) {
      await this.driverLicenseRepository.update(
        { driver_license_id: job.data.driverLicense.driver_license_id },
        { email_send_status: EmailSendStatus.FAILED },
      );
      await this.notificationLogRepository.save({
        reference_type: ReferenceType.DRIVER_LICENSE,
        reference_id: job.data.driverLicense.driver_license_id,
        notification_type: NotificationType.EMAIL,
        user_id: job.data.driverLicense.user?.user_id,
        recipient: job.data.driverLicense.user?.email,
        retry_count: job.attemptsMade,
        send_status: SendStatus.FAILED,
        error_message: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}