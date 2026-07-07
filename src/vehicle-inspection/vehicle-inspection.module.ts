import { Module } from '@nestjs/common';
import { VehicleInspectionService } from './vehicle-inspection.service';
import { VehicleInspectionController } from './vehicle-inspection.controller';
import { VehicleInspection } from './entities/vehicle-inspection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../car/entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleInspection, Car])],
  controllers: [VehicleInspectionController],
  providers: [VehicleInspectionService],
  exports: [VehicleInspectionService],
})
export class VehicleInspectionModule {}
