import { IsNotEmpty, IsDate, IsOptional, IsBoolean, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  manufacturingYear: number;

  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsNotEmpty()
  @IsBoolean()
  hasDualBrake: boolean;

  @IsNotEmpty()
  @IsString()
  drivingSchoolLicenseNumber: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  drivingSchoolLicenseIssueDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  drivingSchoolLicenseExpiryDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  inspectionIssueDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  inspectionExpiryDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  insuranceExpiryDate: Date;

  @IsOptional()
  @IsString()
  imeiDat?: string;

  @IsOptional()
  @IsString()
  serialNumber?: string;
}