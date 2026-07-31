import { Module } from '@nestjs/common';
import { DriverLicenseService } from './driver-license.service';
import { DriverLicenseController } from './driver-license.controller';
import { DriverLicense } from './entities/driver-license.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Settings } from '../settings/entities/setting.entity';
import { EmailModule } from '../email/email.module';
import { NotificationLog } from '../notification-log/entities/notification-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DriverLicense, User, Settings, NotificationLog]),
    EmailModule],
  controllers: [DriverLicenseController],
  providers: [DriverLicenseService],
  exports: [DriverLicenseService],
})
export class DriverLicenseModule { }
