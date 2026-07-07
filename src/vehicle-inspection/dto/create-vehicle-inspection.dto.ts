import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";
import { ExpiryDate } from "../../decorator/expirydate.decorator";

export class CreateVehicleInspectionDto {

    @IsNotEmpty()
    @IsNumber()
    car_id: number;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    inspection_issue_date: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @ExpiryDate('inspection_issue_date')
    inspection_expiry_date: Date;
}
