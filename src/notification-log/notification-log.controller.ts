import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { NotificationLogService } from './notification-log.service';
import { RetryNotificationDto } from './dto/retry-notification.dto';
import { NotificationLogFilterDto } from './dto/filter-notification.dto';
import { PageInputDto } from '../paging/page-input.dto';
import { UserRole } from '../enum/user-role';
import { Roles } from '../decorator/roles.decorator';

@Controller('notification-log')
export class NotificationLogController {
  constructor(private readonly notificationLogService: NotificationLogService) { }

  @Post('retry-notification/:driver_license_id')
  @Roles([UserRole.ADMIN])
  async retryNotification(
    @Param('driver_license_id') driver_license_id: number,
    @Body() retryNotificationDto: RetryNotificationDto,
  ) {
    return this.notificationLogService.retryNotification(driver_license_id, retryNotificationDto);
  }

  @Post('find-all')
  @Roles([UserRole.ADMIN])
  async findAll(@Query() pageInputDto: PageInputDto, @Body() filterDto: NotificationLogFilterDto) {
    return this.notificationLogService.findAll(pageInputDto, filterDto);
  }
}