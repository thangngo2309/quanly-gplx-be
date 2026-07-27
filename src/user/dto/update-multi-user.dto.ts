import { ArrayNotEmpty, IsArray, IsInt, ValidateNested } from "class-validator";
import { MultiDataDto } from "./multi-data.dto";
import { Type } from "class-transformer";

export class UpdateMultiUserDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    user_ids: number[];

    @ValidateNested()
    @Type(() => MultiDataDto)
    data: MultiDataDto;
}