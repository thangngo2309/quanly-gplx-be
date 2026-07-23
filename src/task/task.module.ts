import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from '../settings/entities/setting.entity';
import { TaskService } from './task.service';
import { DriverLicenseModule } from '../driver-license/driver-license.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Settings]), DriverLicenseModule
    ],
    providers: [TaskService],
    exports: [TaskService],
})
export class TaskModule {}