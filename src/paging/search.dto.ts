import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";
import { OrderBy } from "../enum/orderby.enum";

export class SearchDto {
    @IsEnum(OrderBy)
    @IsOptional()
    readonly orderBy?: OrderBy = OrderBy.ASC;

    @IsString()
    @IsOptional()
    readonly name?: string;

    @IsString()
    @IsOptional()
    readonly cccd?: string;

    @IsOptional()
    @IsBoolean()
    readonly active?: boolean;
}