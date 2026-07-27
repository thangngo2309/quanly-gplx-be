import { ArrayNotEmpty, IsArray, IsInt } from "class-validator";

export class DeleteMultiDriverLicenseDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    driver_license_ids: number[];
}