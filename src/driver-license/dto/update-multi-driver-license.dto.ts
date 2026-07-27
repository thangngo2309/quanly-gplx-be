import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsInt, ValidateNested } from "class-validator";
import { MultiDataDto } from "./multi-data.dto";

export class UpdateMultiDriverLicenseDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    driver_license_ids: number[];

    @ValidateNested()
    @Type(() => MultiDataDto)
    data: MultiDataDto;
}