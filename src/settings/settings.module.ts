import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Settings } from './entities/setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Settings]), TaskModule
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
