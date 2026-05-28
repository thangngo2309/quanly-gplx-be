import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { MultiDataDto } from "./multi-data.dto";
import { Type } from "class-transformer";

export class UpdateMultiCarDto {
    @IsArray()
    @ArrayNotEmpty()
    car_ids: number[];

    @ValidateNested()
    @Type(() => MultiDataDto)
    data: MultiDataDto;
}