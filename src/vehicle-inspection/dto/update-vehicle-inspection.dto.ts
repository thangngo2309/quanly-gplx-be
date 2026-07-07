import { PartialType } from '@nestjs/mapped-types';
import { CreateVehicleInspectionDto } from './create-vehicle-inspection.dto';
import { IsBoolean, ValidateIf } from 'class-validator';

export class UpdateVehicleInspectionDto extends PartialType(CreateVehicleInspectionDto) {
    @ValidateIf((o) => o.is_active !== undefined)
    @IsBoolean()
    is_active?: boolean;
}
