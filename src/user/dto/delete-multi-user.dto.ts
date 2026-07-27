import { ArrayNotEmpty, IsArray, IsInt, ValidateNested } from "class-validator";

export class DeleteMultiUserDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    user_ids: number[];
}