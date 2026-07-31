import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { NotificationType } from "../../enum/notification-type.enum";
import { ReferenceType } from "../../enum/reference-type.enum";
import { SendStatus } from "../../enum/send-status.enum";
import { Type } from "class-transformer";

export class CreateNotificationLogDto {
    
    @IsNotEmpty()
    @IsEnum(ReferenceType)
    reference_type: ReferenceType;

    @IsNotEmpty()
    @IsNumber()
    reference_id: number;

    @IsNotEmpty()
    @IsEnum(NotificationType)
    notification_type: NotificationType;

    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsString()
    recipient: string;

    @IsOptional()
    @IsString()
    error_message: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    sent_at: Date;
}