import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { MailService } from './email.service';
import { SendEmailJobData } from './interface/send-email.interface';

@Processor('send-email')
export class EmailConsumer {
  constructor(
    private readonly mailService: MailService,
  ) {}

  @Process('send-email')
  async handleSendEmail(
    job: Job<SendEmailJobData>,
  ) {
    try {
      await this.mailService.sendMail(job.data);
    } catch (error) {
      throw error;
    }
  }
}