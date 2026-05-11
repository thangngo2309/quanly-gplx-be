import { UserRole } from "../../enum/user-role";
import { IsString, IsNotEmpty, IsEnum, MinLength, MaxLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    @MinLength(3)
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
