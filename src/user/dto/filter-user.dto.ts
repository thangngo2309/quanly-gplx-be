import { IsBoolean, IsOptional, IsString } from "class-validator";

export class FilterUserDto {
    @IsString()
    @IsOptional()
    readonly name?: string;

    @IsString()
    @IsOptional()
    readonly sortBy?: string;

    @IsString()
    @IsOptional()
    readonly sortDirection?: 'ASC' | 'DESC';

    @IsString()
    @IsOptional()
    readonly cccd?: string;

    @IsOptional()
    @IsBoolean()
    readonly active?: boolean;

    @IsString()
    @IsOptional()
    readonly role?: string;

    @IsString()
    @IsOptional()
    readonly phone_number?: string;

    @IsString()
    @IsOptional()
    readonly email?: string;
}