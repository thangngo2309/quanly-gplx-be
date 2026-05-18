import { UserRole } from "../../enum/user-role";
import { IsString, IsNotEmpty, IsEnum, MinLength, MaxLength, Matches } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(3)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Username chỉ được chứa chữ cái, số và dấu gạch dưới' })
    username: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    fullname: string;

    @IsEnum(UserRole)
    @IsNotEmpty()
    role: UserRole;
}
