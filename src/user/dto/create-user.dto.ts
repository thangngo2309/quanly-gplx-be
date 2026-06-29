import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxDate,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserRole } from '../../enum/user-role';
import { RecruitmentType } from '../../enum/recruitment_type.enum';
import { TeachingSubject } from '../../enum/teaching-subject.enum';
import { ExpiryDate } from '../../decorator/expirydate.decorator';
import { UserPedagogyLevel } from '../../enum/user-pedagogy-level.enum';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  fullname: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @MaxDate(
    () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 18);
      return date;
    },
    {
      message: () => `Người dùng phải đủ 18 tuổi`,
    },
  )
  date_of_birth: Date;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9]{12}$/, { message: 'CCCD phải gồm 12 số' })
  citizen_id: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  address: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsEnum(RecruitmentType)
  recruitment_type?: RecruitmentType;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  education_level?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  professional_level?: string;

  @IsOptional()
  @IsEnum(UserPedagogyLevel)
  pedagogy_level?: UserPedagogyLevel;

  @IsOptional()
  @IsEnum(TeachingSubject)
  teaching_subject?: TeachingSubject;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^\S+$/, { message: 'Giấy chứng nhận giáo viên chỉ chứa chữ, số và kí tự đặc biệt, không có khoảng trắng' })
  teacher_certificate_number?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(() => new Date(), {
    message: () =>
      `Ngày cấp giấy chứng nhận giáo viên không được là ngày trong tương lai`,
  })
  teacher_certificate_issue_date?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  teacher_certificate_issue_place?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^\S+$/, { message: 'Giấy chứng nhận sức khỏe chỉ chứa chữ, số và kí tự đặc biệt, không có khoảng trắng' })
  health_certificate_number?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  health_certificate_expiry_date?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^\S+$/, { message: 'Số hợp đồng chỉ chứa chữ, số và kí tự đặc biệt, không có khoảng trắng' })
  contract_number?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @MaxDate(() => new Date(), {
    message: () =>
      `Ngày ký hợp đồng không được là ngày trong tương lai`,
  })
  contract_signed_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ExpiryDate('contract_signed_date')
  contract_expiry_date?: Date;

  @IsOptional()
  test_date_time?: Date;
}