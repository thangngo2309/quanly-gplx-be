import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CarCategory } from '../../enum/car-category.enum';
import { VehicleInspection } from '../../vehicle-inspection/entities/vehicle-inspection.entity';

@Entity('car')
export class Car {
  @PrimaryGeneratedColumn()
  car_id: number;

  @Column()
  registrationNumber: string;

  @Column()
  brand: string;

  @Column({ type: 'enum', enum: CarCategory, default: CarCategory.A })
  category: CarCategory;

  @Column()
  manufacturingYear: number;

  @Column()
  owner: string;

  @Column({ default: false })
  hasDualBrake: boolean;

  @Column()
  practiceVehicleLicenseNumber: string;

  @Column({ type: 'date' })
  practiceVehicleLicenseIssueDate: Date;

  @Column({ type: 'date' })
  practiceVehicleLicenseExpiryDate: Date;

  @Column({ type: 'date' })
  inspectionIssueDate: Date;

  @Column({ type: 'date' })
  inspectionExpiryDate: Date;

  @Column({ type: 'date' })
  insuranceExpiryDate: Date;

  @Column({ nullable: true })
  imeiDat: string;

  @Column({ nullable: true })
  serialNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(() => VehicleInspection, (vehicleInspection) => vehicleInspection.car)
  vehicle_inspection: VehicleInspection[];
}