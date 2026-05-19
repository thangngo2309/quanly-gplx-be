import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('car')
export class Car {
  @PrimaryGeneratedColumn()
  car_id: number;

  @Column()
  registrationNumber: string;

  @Column()
  brand: string;

  @Column()
  category: string;

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}