import { DriverLicense } from "../../driver-license/entities/driver-license.entity";

export interface SendEmailJobData {
  driverLicense: DriverLicense;
}