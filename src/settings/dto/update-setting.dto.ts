
import { PartialType } from '@nestjs/mapped-types';
import { CreateSettingDto } from './create-setting.dto';
import { IsBoolean, ValidateIf } from 'class-validator';

export class UpdateSettingDto extends PartialType(CreateSettingDto) {
    @ValidateIf(o => o.is_active !== undefined)
    @IsBoolean()
    is_active?: boolean;
}
