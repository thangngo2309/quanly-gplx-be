import { BullModule } from "@nestjs/bull";
import { Module } from '@nestjs/common';
import { EmailConsumer } from "./email.consumer";
import { MailService } from "./email.service";

@Module({
    imports: [
        BullModule.registerQueue({
            name: 'send-email',
        }),
    ],
    providers: [EmailConsumer, MailService],
    exports: [MailService, BullModule],
})
export class EmailModule {}