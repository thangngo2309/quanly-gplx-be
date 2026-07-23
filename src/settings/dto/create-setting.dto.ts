import { IsNotEmpty, IsString } from "class-validator";

export class CreateSettingDto {
    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    @IsString()
    value: string;
}
