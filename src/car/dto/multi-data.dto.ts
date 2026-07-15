import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateIf } from "class-validator";
import { Type } from "class-transformer";
import { ExpiryDate } from "../../decorator/expirydate.decorator";
import { CarCategory } from "../../enum/car-category.enum";

export class MultiDataDto {
  @IsOptional()
  @IsString()
  vehicle_type?: string;
  
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsEnum(CarCategory)
  category?: CarCategory;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(2000)
  manufacturingYear?: number;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  owner?: string;

  @ValidateIf(o => o.hasDualBrake !== undefined)
  @IsBoolean()
  hasDualBrake?: boolean;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  practiceVehicleLicenseIssueDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ExpiryDate('practiceVehicleLicenseIssueDate')
  practiceVehicleLicenseExpiryDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  insuranceExpiryDate?: Date;

  @ValidateIf(o => o.isActive !== undefined)
  @IsBoolean()
  isActive?: boolean;
}