import { IsBoolean, IsDateString, IsEnum, IsOptional, IsString, MaxLength } from "class-validator";
import { TeachingSubject } from "../../enum/teaching-subject.enum";
import { RecruitmentType } from "../../enum/recruitment_type.enum";
import { ExpiryDate } from "../../decorator/expirydate.decorator";

export class MultiDataDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    fullname?: string;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @IsString()
    @MaxLength(255)
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
    @IsDateString()
    teacher_certificate_issue_date?: Date;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    teacher_certificate_issue_place?: string;

    @IsOptional()
    @IsDateString()
    health_certificate_expiry_date?: Date;

    @IsOptional()
    @IsDateString()
    contract_signed_date?: Date;

    @IsOptional()
    @IsDateString()
    @ExpiryDate('contract_signed_date')
    contract_expiry_date?: Date;
}