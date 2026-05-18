import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async signIn(username: string, pass: string): Promise<{ access_token: string, refresh_token?: string }> {
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng");

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng");
    }

    const payload = { sub: user.user_id, username: user.username, fullname: user.fullname, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as any,
      }),

      refresh_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || "7d") as any,
      }),
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET
      });

      const user = await this.usersService.findByUsername(payload.username);
      if (!user) throw new BadRequestException("Tên đăng nhập hoặc mật khẩu không đúng");

      const newPayload = {
        sub: user.user_id,
        username: user.username,
        fullname: user.fullname,
        role: user.role
      };

      const access_token = await this.jwtService.signAsync(newPayload, {
        expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as any,
      });

      return { access_token };

    } catch (err: any) {
      console.error('Error refreshing token:', err);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async getProfile(userId: number): Promise<ProfileResponseDto> {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new UnauthorizedException();

    const dto = new ProfileResponseDto()
    dto.user_id = user.user_id
    dto.username = user.username
    dto.fullname = user.fullname
    dto.role = user.role
    dto.is_active = user.is_active

    return dto;
  }
}
