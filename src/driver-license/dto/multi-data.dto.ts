import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";
import { ExpiryDate } from "../../decorator/expirydate.decorator";

export class MultiDataDto {
        @IsOptional()
        @IsNotEmpty()
        @IsNumber()
        user_id?: number;

        @IsOptional()
        @IsNotEmpty()
        @IsString()
        @Matches(/^[A-Z0-9]+$/, { message: 'Giấy phép lái xe chỉ chấp nhận ký tự in hoa và số' })
        license_number?: string;
    
        @IsOptional()
        @IsDate()
        @Type(() => Date)
        @ExpiryDate('pass_date')
        issue_date?: Date;
    
        @IsOptional()
        @IsDate()
        @Type(() => Date)
        @ExpiryDate('expiry_date')
        expiry_date?: Date;
    
        @IsOptional()
        @IsDate()
        @Type(() => Date)
        pass_date?: Date;
    
        @IsOptional()
        @IsNotEmpty()
        @IsString()
        issue_place?: string;

        @IsOptional()
        @IsBoolean()
        is_active?: boolean;
}