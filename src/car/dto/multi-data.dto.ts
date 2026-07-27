import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateIf } from "class-validator";
import { Transform, Type } from "class-transformer";
import { ExpiryDate } from "../../decorator/expirydate.decorator";
import { CarCategory } from "../../enum/car-category.enum";

export class MultiDataDto {
  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  vehicle_type?: string;

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  brand?: string;

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsEnum(CarCategory)
  category?: CarCategory;

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(2000)
  manufacturingYear?: number;

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  owner?: string;

  @ValidateIf(o => o.hasDualBrake !== undefined)
  @IsBoolean()
  hasDualBrake?: boolean;

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  practiceVehicleLicenseIssueDate?: Date;

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ExpiryDate('practiceVehicleLicenseIssueDate')
  practiceVehicleLicenseExpiryDate?: Date;

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  insuranceExpiryDate?: Date;

  @ValidateIf(o => o.isActive !== undefined)
  @IsBoolean()
  isActive?: boolean;
}