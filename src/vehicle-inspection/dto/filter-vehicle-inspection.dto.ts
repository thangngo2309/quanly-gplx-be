import { IsBoolean, IsOptional, IsString } from "class-validator";

export class FilterVehicleInspectionDto {
    @IsString()
    @IsOptional()
    readonly registration_number?: string;

    @IsOptional()
    @IsBoolean()
    readonly is_active?: boolean;

    @IsString()
    @IsOptional()
    readonly sort_by?: string;

    @IsString()
    @IsOptional()
    readonly sort_direction?: 'ASC' | 'DESC';
}