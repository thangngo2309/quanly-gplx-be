import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { GreaterDateOrEqual } from '../../decorator/greater-date-or-equal.decorator';
import { ExpiryDate } from '../../decorator/expirydate.decorator';

export class UpdateDriverLicenseDto {
    @Transform(({ value }) => value === null ? undefined : value)
    @IsOptional()
    @IsInt()
    user_id?: number;

    @Transform(({ value }) => value === null ? undefined : value)
    @IsOptional() @IsString()
    @Matches(/^[A-Z0-9]+$/, { message: 'Giấy phép lái xe chỉ chấp nhận ký tự in hoa và số' })
    license_number?: string;

    @Transform(({ value }) => value === null ? undefined : value)
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @GreaterDateOrEqual('pass_date')
    issue_date?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ExpiryDate('issue_date')
    expiry_date?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    pass_date?: Date;

    @Transform(({ value }) => value === null ? undefined : value)
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    issue_place?: string;

    @ValidateIf(o => o.is_active !== undefined)
    @IsBoolean()
    is_active?: boolean;
}
