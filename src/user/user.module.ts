import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverLicense } from '../driver-license/entities/driver-license.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, DriverLicense])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
