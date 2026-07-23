import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailJobData } from './interface/send-email.interface';
import dayjs from 'dayjs';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
    ) { }

    async sendMail(data: SendEmailJobData) {
        try {
            const expiryDate = dayjs(
                data.driverLicense.expiry_date,
            ).format('DD/MM/YYYY');
            await this.mailerService.sendMail({
                to: data.driverLicense.user.email,
                subject: 'Thông báo hết hạn GPLX',
                text: ``,
                html: `
          <h3>Thông báo hết hạn GPLX</h3>
          <p>Xin chào <b>${data.driverLicense.user.fullname}</b></p>
          <p>
            GPLX của bạn là:
            <b>${data.driverLicense.license_number}</b>
          </p>
          <p>
            Sắp đến ngày hết hạn là ngày:
            <b>${expiryDate}.</b>
          </p>
          <p>
            Vui lòng gia hạn GPLX trước ngày hết hạn để tránh bị phạt.
          </p>
        `,
            });

            this.logger.log(`Email sent to ${data.driverLicense.user.email}`);
            return true;

        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}