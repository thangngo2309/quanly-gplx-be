import { IsNotEmpty, IsDate, IsOptional, IsBoolean, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ExpiryDate } from '../../decorator/expirydate.decorator';

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
  @Min(1950)
  manufacturingYear: number;

  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsNotEmpty()
  @IsBoolean()
  hasDualBrake: boolean;

  @IsNotEmpty()
  @IsString()
  practiceVehicleLicenseNumber: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  practiceVehicleLicenseIssueDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ExpiryDate('practiceVehicleLicenseIssueDate')
  practiceVehicleLicenseExpiryDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  inspectionIssueDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ExpiryDate('inspectionIssueDate')
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