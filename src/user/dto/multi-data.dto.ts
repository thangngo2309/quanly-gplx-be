import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, MaxDate, MaxLength, ValidateIf } from "class-validator";
import { TeachingSubject } from "../../enum/teaching-subject.enum";
import { RecruitmentType } from "../../enum/recruitment_type.enum";
import { ExpiryDate } from "../../decorator/expirydate.decorator";
import { UserPedagogyLevel } from "../../enum/user-pedagogy-level.enum";
import { Type } from "class-transformer";

export class MultiDataDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @IsNotEmpty({ message: 'Nếu cập nhật tên, không được gửi chuỗi rỗng' })
    fullname?: string;

    @ValidateIf(o => o.is_active !== undefined)
    @IsBoolean()
    is_active?: boolean;

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
    @IsEnum(UserPedagogyLevel)
    pedagogy_level?: UserPedagogyLevel;

    @IsOptional()
    @IsEnum(TeachingSubject)
    teaching_subject?: TeachingSubject;

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
    @IsDate()
    @Type(() => Date)
    health_certificate_expiry_date?: Date;

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
}