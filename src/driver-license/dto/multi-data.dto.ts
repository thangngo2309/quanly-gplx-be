import { Transform, Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, ValidateIf } from "class-validator";
import { ExpiryDate } from "../../decorator/expirydate.decorator";
import { GreaterDateOrEqual } from "../../decorator/greater-date-or-equal.decorator";

export class MultiDataDto {

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