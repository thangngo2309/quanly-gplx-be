import { IsNotEmpty, IsDate, IsBoolean, IsString, IsNumber, Min, Matches, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ExpiryDate } from '../../decorator/expirydate.decorator';
import { IsValidRegistrationNumber } from '../../decorator/valid-registration-number.decorator';
import { CarCategory } from '../../enum/car-category.enum';

export class CreateCarDto {
  @IsNotEmpty()
  @IsString()
  @IsValidRegistrationNumber()
  registrationNumber: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9]{1,20}$/, { message: 'Số khung chỉ được chứa chữ in hoa, số và dấu gạch ngang, tối đa 20 ký tự' })
  chassis_number: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9]{1,20}$/, { message: 'Số máy chỉ được chứa chữ in hoa, số và dấu gạch ngang, tối đa 20 ký tự' })
  engine_number: string;

  @IsNotEmpty()
  @IsString()
  vehicle_type: string;

  @IsNotEmpty()
  @IsString()
  brand: string;

  @IsNotEmpty()
  @IsEnum(CarCategory)
  category: CarCategory;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(2000)
  manufacturingYear: number;

  @IsNotEmpty()
  @IsString()
  owner: string;

  @IsNotEmpty()
  @IsBoolean()
  hasDualBrake: boolean;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9/]+$/, { message: 'Số giấy phép xe tập lái chỉ được chứa chữ in hoa, số và dấu gạch chéo' })
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
  insuranceExpiryDate: Date;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{15}$/, { message: 'Số IMEI phải có đúng 15 chữ số' })
  imeiDat?: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Z0-9-]+$/, { message: 'Số seri chỉ được chứa chữ in hoa, số và dấu gạch ngang' })
  serialNumber?: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  inspection_issue_date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ExpiryDate('inspection_issue_date')
  inspection_expiry_date: Date;
}