import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as any,
        },
      }),
    }),
  ],
  providers: [AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {provide: APP_GUARD, useClass: RolesGuard} 
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }
