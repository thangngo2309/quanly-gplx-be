import { IsNotEmpty, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username chỉ được chứa chữ cái, số và dấu gạch dưới' })
  @MaxLength(50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(200)
  password: string;
}