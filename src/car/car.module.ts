import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './entities/car.entity';
import { VehicleInspection } from '../vehicle-inspection/entities/vehicle-inspection.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Car, VehicleInspection])],
  controllers: [CarController],
  providers: [CarService],
  exports: [CarService],
})
export class CarModule {}
