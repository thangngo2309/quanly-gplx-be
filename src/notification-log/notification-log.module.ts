import { Module } from '@nestjs/common';
import { NotificationLogService } from './notification-log.service';
import { NotificationLogController } from './notification-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationLog } from './entities/notification-log.entity';
import { DriverLicense } from '../driver-license/entities/driver-license.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DriverLicense, NotificationLog]),
     EmailModule
  ],
  controllers: [NotificationLogController],
  providers: [NotificationLogService],
})
export class NotificationLogModule { }
