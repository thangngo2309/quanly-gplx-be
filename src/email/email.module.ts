import { BullModule } from "@nestjs/bull";
import { Module } from '@nestjs/common';
import { EmailConsumer } from "./email.consumer";
import { MailService } from "./email.service";
import { DriverLicense } from "../driver-license/entities/driver-license.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'send-email',
        }),
        TypeOrmModule.forFeature([DriverLicense]),
    ],
    providers: [EmailConsumer, MailService],
    exports: [MailService, BullModule],
})
export class EmailModule {}