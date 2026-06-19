import { IsBoolean, IsOptional, IsString } from "class-validator";

export class DriverLicenseFilterDto {
  @IsString()
  @IsOptional()
  readonly license_number?: string;

  @IsString()
  @IsOptional()
  readonly fullname?: string;

  @IsBoolean()
  @IsOptional()
  readonly active?: boolean;

  @IsString()
  @IsOptional()
  readonly sortDirection?: 'ASC' | 'DESC';

  @IsString()
  @IsOptional()
  readonly sortBy?: string;
}