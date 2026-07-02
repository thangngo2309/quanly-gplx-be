import { PartialType } from '@nestjs/mapped-types';
import { CreateCarDto } from './create-car.dto';
import { IsBoolean, ValidateIf } from 'class-validator';

export class UpdateCarDto extends PartialType(CreateCarDto) {
  @ValidateIf(o => o.isActive !== undefined)
  @IsBoolean()
  isActive?: boolean;

  @ValidateIf((o) => o.hasDualBrake !== undefined)
  @IsBoolean()
  hasDualBrake?: boolean;
}