import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { Settings } from './entities/setting.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { TaskService } from '../task/task.service';
import { emailSendTimeSetting } from '../constant/setting.constant';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Settings)
    private settingsRepository: Repository<Settings>,
    private readonly taskService: TaskService,
    ) { }

  async create(createSettingDto: CreateSettingDto) {
    const setting = await this.settingsRepository.create(createSettingDto);
    return this.settingsRepository.save(setting);
  }

  async findAll() {
    return await this.settingsRepository.find({ where: { is_deleted: false }});
  }

  async findOne(id: number) {
    const existing = await this.settingsRepository.findOne({ where: { setting_id: id, is_deleted: false }});
    if (!existing) {
      throw new BadRequestException(`Không tìm thấy setting với id ${id}`);
    }
    return existing;
  }

  async update(id: number, updateSettingDto: UpdateSettingDto) {
    await this.settingsRepository.update(id, updateSettingDto);
    const updatedSetting = await this.findOne(id);
    if (updatedSetting.key === emailSendTimeSetting) {
      await this.taskService.updateCron(updatedSetting.value);
    }
    return { message: `Cập nhật setting ${updatedSetting.key} thành công`};
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    existing.is_deleted = true;
    return await this.settingsRepository.save(existing);
  }
}
