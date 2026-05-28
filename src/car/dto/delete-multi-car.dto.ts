import { ArrayNotEmpty, IsArray} from "class-validator";

export class DeleteMultiCarDto {
    @IsArray()
    @ArrayNotEmpty()
    car_ids: number[];
}