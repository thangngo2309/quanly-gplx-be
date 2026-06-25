import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { ExpiryDate } from "../../decorator/expirydate.decorator";

export class CreateDriverLicenseDto {
    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Z0-9]+$/, { message: 'Giấy phép lái xe chỉ chấp nhận ký tự in hoa và số' })
    license_number: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @ExpiryDate('pass_date')
    issue_date: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    @ExpiryDate('issue_date')
    expiry_date?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    pass_date?: Date;

    @IsNotEmpty()
    @IsString()
    issue_place: string;
}
