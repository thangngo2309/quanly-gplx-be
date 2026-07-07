import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Car } from "../../car/entities/car.entity";

@Entity('vehicle_inspection')
export class VehicleInspection {
    @PrimaryGeneratedColumn()
    vehicle_inspection_id: number;

    @Column({ type: 'number' })
    car_id: number;

    @ManyToOne(() => Car, (car) => car.vehicle_inspection)
    @JoinColumn({ name: 'car_id' })
    car: Car;

    @Column({ type: 'date' })
    inspection_issue_date: Date;

    @Column({ type: 'date' })
    inspection_expiry_date: Date;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'boolean', default: false })
    is_deleted: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}
