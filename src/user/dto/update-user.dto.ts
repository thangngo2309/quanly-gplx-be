import { IsEnum, IsOptional, IsString } from "class-validator";
import { UserRole } from "../../enum/user-role";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    fullname?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
