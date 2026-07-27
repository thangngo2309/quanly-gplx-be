import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsOptional, ValidateIf } from 'class-validator';
import { ExpiryDate } from '../../decorator/expirydate.decorator';

export class UpdateVehicleInspectionDto {

    @Transform(({ value }) => value === null ? undefined : value)
    @IsOptional()
    @IsInt()
    car_id?: number;

    @Transform(({ value }) => value === null ? undefined : value)
    @IsOptional() 
    @IsDate()
    @Type(() => Date)
    inspection_issue_date?: Date;

    @Transform(({ value }) => value === null ? undefined : value)
    @IsOptional() 
    @IsDate()
    @Type(() => Date)
    @ExpiryDate('inspection_issue_date')
    inspection_expiry_date?: Date;

    @ValidateIf((o) => o.is_active !== undefined)
    @IsBoolean()
    is_active?: boolean;
}
