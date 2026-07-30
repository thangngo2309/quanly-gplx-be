import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { MailService } from './email.service';
import { SendEmailJobData } from './interface/send-email.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverLicense } from '../driver-license/entities/driver-license.entity';
import { Repository } from 'typeorm';
import { EmailSendStatus } from '../enum/email-send-status.enum';

@Processor('send-email')
export class EmailConsumer {
  constructor(
    private readonly mailService: MailService,
    @InjectRepository(DriverLicense)
    private driverLicenseRepository: Repository<DriverLicense>,
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
    } catch (error) {
      await this.driverLicenseRepository.update(
        { driver_license_id: job.data.driverLicense.driver_license_id },
        { email_send_status: EmailSendStatus.FAILED },
      );
      throw error;
    }
  }
}