import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn()
  setting_id: number;

  @Column({ type: 'varchar'})
  key: string;

  @Column({ type: 'varchar'})
  value: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted: boolean;
}