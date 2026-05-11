import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from '../../enum/user-role';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ select: false, type: 'varchar', length: 200 })
  password: string;

  @Column({ type: 'varchar', length: 100 })
  fullname: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;
}
