import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min, ValidateIf } from 'class-validator';
import { IsValidRegistrationNumber } from '../../decorator/valid-registration-number.decorator';
import { CarCategory } from '../../enum/car-category.enum';
import { Transform, Type } from 'class-transformer';
import { ExpiryDate } from '../../decorator/expirydate.decorator';

export class UpdateCarDto{
  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsString()
  @IsValidRegistrationNumber()
  registrationNumber?: string;

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{1,20}$/, { message: 'Số khung chỉ được chứa chữ in hoa, số và dấu gạch ngang, tối đa 20 ký tự' })
  chassis_number?: string;

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9]{1,20}$/, { message: 'Số máy chỉ được chứa chữ in hoa, số và dấu gạch ngang, tối đa 20 ký tự' })
  engine_number?: string;

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

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9/]+$/, { message: 'Số giấy phép xe tập lái chỉ được chứa chữ in hoa, số và dấu gạch chéo' })
  practiceVehicleLicenseNumber?: string;

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

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{15}$/, { message: 'Số IMEI phải có đúng 15 chữ số' })
  imeiDat?: string;

  @Transform(({ value }) => value === null ? undefined : value)
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9-]+$/, { message: 'Số seri chỉ được chứa chữ in hoa, số và dấu gạch ngang' })
  serialNumber?: string;

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
  
  @ValidateIf(o => o.isActive !== undefined)
  @IsBoolean()
  isActive?: boolean;

  @ValidateIf((o) => o.hasDualBrake !== undefined)
  @IsBoolean()
  hasDualBrake?: boolean;
}