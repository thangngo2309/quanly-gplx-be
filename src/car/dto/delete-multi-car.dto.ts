import { ArrayNotEmpty, IsArray, IsInt } from "class-validator";

export class DeleteMultiCarDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    car_ids: number[];
}