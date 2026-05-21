import { IsNotEmpty, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(200)
  password: string;
}