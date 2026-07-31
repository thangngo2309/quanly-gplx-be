import { PartialType } from "@nestjs/mapped-types";
import { CreateNotificationLogDto } from "./create-notification.dto";

export class UpdateNotificationLogDto extends PartialType(CreateNotificationLogDto) { }