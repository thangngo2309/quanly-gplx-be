import { PartialType } from '@nestjs/mapped-types';
import { CreateDriverLicenseDto } from './create-driver-license.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateDriverLicenseDto extends PartialType(CreateDriverLicenseDto) {
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;
}
