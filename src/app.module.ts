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
      entities: [User, Car, DriverLicense],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CarModule,
    DriverLicenseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
