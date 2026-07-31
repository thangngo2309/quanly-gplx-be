import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { CarModule } from './car/car.module';
import { Car } from './car/entities/car.entity';
import { DriverLicenseModule } from './driver-license/driver-license.module';
import { DriverLicense } from './driver-license/entities/driver-license.entity';
import { VehicleInspectionModule } from './vehicle-inspection/vehicle-inspection.module';
import { VehicleInspection } from './vehicle-inspection/entities/vehicle-inspection.entity';
import { SettingsModule } from './settings/settings.module';
import { Settings } from './settings/entities/setting.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskModule } from './task/task.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { NotificationLogModule } from './notification-log/notification-log.module';
import { NotificationLog } from './notification-log/entities/notification-log.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Car, DriverLicense, VehicleInspection, Settings, NotificationLog],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CarModule,
    DriverLicenseModule,
    VehicleInspectionModule,
    SettingsModule,
    TaskModule,
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    NotificationLogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
