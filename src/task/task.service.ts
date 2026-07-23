import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob, CronTime } from 'cron';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from '../settings/entities/setting.entity';
import { DriverLicenseService } from '../driver-license/driver-license.service';
import { emailSendTimeSetting } from '../constant/setting.constant';

@Injectable()
export class TaskService implements OnModuleInit {
    private readonly logger = new Logger(TaskService.name);

    constructor(
        private schedulerRegistry: SchedulerRegistry,
        private readonly driverLicenseService: DriverLicenseService,
        @InjectRepository(Settings)
        private readonly settingsRepository: Repository<Settings>,
    ) { }

    async onModuleInit() {
        this.logger.log('Khởi tạo cron validate-driver-licenses-expiry-date...');
        await this.createCron();
    }

    async createCron() {
        const setting = await this.settingsRepository.findOne({
            where: { key: emailSendTimeSetting, is_deleted: false, is_active: true },
        });

        if (!setting) {
            this.logger.error('Cron validate-driver-licenses-expiry-date đang bị tắt hoặc chưa được cấu hình trong bảng settings.');
            return;
        }
        const cronExpression = setting.value;
        try {
            const job = new CronJob(
                cronExpression,
                async () => {
                    this.logger.log(`Chạy kiểm tra GPLX theo lịch`);
                    await this.driverLicenseService.sendExpiryReminder();
                },
            );
            this.schedulerRegistry.addCronJob('validate-driver-licenses-expiry-date', job);
            job.start();
            this.logger.log(`Cron đã tạo validate-driver-licenses-expiry-date: ${cronExpression}`);
        } catch (error) {
            this.logger.error(
                `Cron expression không hợp lệ: "${cronExpression}"`,
            );
        }
    }

    async updateCron(value: string) {
        const cronExpression = value;
        const job = this.schedulerRegistry.getCronJob('validate-driver-licenses-expiry-date');
        job.setTime(new CronTime(cronExpression),);
        this.logger.log(`Cron được cập nhật: validate-driver-licenses-expiry-date:  ${cronExpression}`);
    }
}