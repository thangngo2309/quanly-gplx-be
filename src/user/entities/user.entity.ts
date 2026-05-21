import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from '../../enum/user-role';
import { TeachingSubject } from "../../enum/teaching-subject.enum";
import { RecruitmentType } from "../../enum/recruitment_type.enum";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ select: false, type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  fullname: string;

  @Column({ type: 'date' })
  date_of_birth: Date;

  @Column({ type: 'varchar', length: 12})
  citizen_id: string;

  @Column({ type: 'varchar', length: 255})
  address: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  education_level: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  professional_level: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pedagogy_level: string;

  @Column({ type: 'enum', enum: TeachingSubject, nullable: true })
  teaching_subject: TeachingSubject;

  @Column({ type: 'varchar', length: 100, nullable: true })
  teacher_certificate_number: string;

  @Column({ type: 'date', nullable: true })
  teacher_certificate_issue_date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  teacher_certificate_issue_place: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  health_certificate_number: string;

  @Column({ type: 'date', nullable: true })
  health_certificate_expiry_date: Date;

  @Column({ type: 'enum', enum: RecruitmentType, nullable: true })
  recruitment_type: RecruitmentType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  contract_number: string;

  @Column({ type: 'date', nullable: true })
  contract_signed_date: Date;

  @Column({ type: 'date', nullable: true })
  contract_expiry_date: Date;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;
}
