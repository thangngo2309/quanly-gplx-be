import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('driver_licenses')
export class DriverLicense {
  @PrimaryGeneratedColumn()
  driver_license_id: number;

  @Column({ type: 'number' })
  user_id: number;

  @ManyToOne(() => User, (user) => user.driver_licenses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar'})
  license_number: string;

  @Column({ type: 'date' })
  issue_date: Date;

  @Column({ type: 'date', nullable: true })
  expiry_date: Date;

  @Column({ type: 'date', nullable: true })
  pass_date: Date;

  @Column({ type: 'varchar' })
  issue_place: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
