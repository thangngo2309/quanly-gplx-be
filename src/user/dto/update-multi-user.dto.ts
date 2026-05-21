import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { MultiDataDto } from "./multi-data.dto";
import { Type } from "class-transformer";

export class UpdateMultiUserDto {
    @IsArray()
    @ArrayNotEmpty()
    user_ids: number[];

    @ValidateNested()
    @Type(() => MultiDataDto)
    data: MultiDataDto;
}