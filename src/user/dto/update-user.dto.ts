import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";
import { RecruitmentType } from "../../enum/recruitment_type.enum";
import { TeachingSubject } from "../../enum/teaching-subject.enum";
import { ExpiryDate } from "../../decorator/expirydate.decorator";
export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @IsNotEmpty({ message: 'Nếu cập nhật tên, không được gửi chuỗi rỗng' })
    fullname?: string;

    @IsOptional()
    @IsDateString()
    date_of_birth?: Date;

    @IsOptional()
    @IsString()
    @Matches(/^[0-9]{12}$/, { message: 'CCCD phải gồm 12 số' })
    citizen_id?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    @IsNotEmpty({ message: 'Nếu cập nhật địa chỉ, không được gửi chuỗi rỗng' })
    address?: string;

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
    @IsString()
    @MaxLength(255)
    pedagogy_level?: string;

    @IsOptional()
    @IsEnum(TeachingSubject)
    teaching_subject?: TeachingSubject;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Matches(/^\S+$/, { message: 'Giấy chứng nhận giáo viên chỉ chứa chữ, số và kí tự đặc biệt, không có khoảng trắng' })
    teacher_certificate_number?: string;

    @IsOptional()
    @IsDateString()
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
    @IsDateString()
    health_certificate_expiry_date?: Date;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Matches(/^\S+$/, { message: 'Số hợp đồng chỉ chứa chữ, số và kí tự đặc biệt, không có khoảng trắng' })
    contract_number?: string;

    @IsOptional()
    @IsDateString()
    contract_signed_date?: Date;

    @IsOptional()
    @IsDateString()
    @ExpiryDate('contract_signed_date')
    contract_expiry_date?: Date;
}
