import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CarFilterDto {
  @IsString()
  @IsOptional()
  readonly registrationNumber?: string;

  @IsString()
  @IsOptional()
  readonly imeiDat?: string;

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