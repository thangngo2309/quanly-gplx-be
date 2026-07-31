import { IsEnum, IsNotEmpty } from 'class-validator';
import { NotificationType } from '../../enum/notification-type.enum';

export class RetryNotificationDto {
  @IsNotEmpty()
  @IsEnum(NotificationType)
  notification_type: NotificationType = NotificationType.EMAIL;
}