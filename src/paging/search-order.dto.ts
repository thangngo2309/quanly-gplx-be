import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderBy } from "../enum/orderby.enum";

export class SearchOrderDto {
    @IsEnum(OrderBy)
    @IsOptional()
    readonly orderBy?: OrderBy = OrderBy.ASC;

    @IsString()
    @IsOptional()
    readonly searchName?: string;
}