import { ArrayNotEmpty, IsArray } from "class-validator";

export class DeleteMultiDriverLicenseDto {
    @IsArray()
    @ArrayNotEmpty()
    driver_license_ids: number[];
}