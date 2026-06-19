import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, ValidateNested } from "class-validator";
import { MultiDataDto } from "./multi-data.dto";

export class UpdateMultiDriverLicenseDto {
    @IsArray()
    @ArrayNotEmpty()
    driver_license_ids: number[];

    @ValidateNested()
    @Type(() => MultiDataDto)
    data: MultiDataDto;
}