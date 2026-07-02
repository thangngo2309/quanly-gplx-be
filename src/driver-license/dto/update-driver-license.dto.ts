import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverLicenseDto } from './create-driver-license.dto';
import { IsBoolean, ValidateIf } from 'class-validator';

export class UpdateDriverLicenseDto extends PartialType(CreateDriverLicenseDto) {
    @ValidateIf(o => o.is_active !== undefined)
    @IsBoolean()
    is_active?: boolean;
}
