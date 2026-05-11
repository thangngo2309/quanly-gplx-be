import { IsInt, IsOptional, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { SearchOrderDto }from "./search-order.dto";

export class PageInputDto extends SearchOrderDto {

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    @IsOptional()
    readonly limit?: number = 10;

    get skip(): number {
        return (this.page! - 1) * this.limit!;
    }
}
