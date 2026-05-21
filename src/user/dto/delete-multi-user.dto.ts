import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";

export class DeleteMultiUserDto {
    @IsArray()
    @ArrayNotEmpty()
    user_ids: number[];
}