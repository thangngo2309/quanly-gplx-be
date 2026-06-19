import { Module } from '@nestjs/common';
import { DriverLicenseService } from './driver-license.service';
import { DriverLicenseController } from './driver-license.controller';
import { DriverLicense } from './entities/driver-license.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DriverLicense])],
  controllers: [DriverLicenseController],
  providers: [DriverLicenseService],
  exports: [DriverLicenseService],
})
export class DriverLicenseModule {}
