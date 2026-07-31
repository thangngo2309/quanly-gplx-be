import { IsOptional, IsEnum, IsString, IsIn, IsBoolean } from 'class-validator';
import { NotificationType } from '../../enum/notification-type.enum';
import { ReferenceType } from '../../enum/reference-type.enum';
import { SendStatus } from '../../enum/send-status.enum';

export class NotificationLogFilterDto {
    @IsOptional()
    @IsEnum(ReferenceType)
    reference_type?: ReferenceType;

    @IsOptional()
    @IsEnum(NotificationType)
    notification_type?: NotificationType;

    @IsOptional()
    @IsEnum(SendStatus)
    send_status?: SendStatus;

    @IsOptional()
    @IsString()
    recipient?: string;

    @IsOptional()
    @IsString()
    fullname?: string;
}