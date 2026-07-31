import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ReferenceType } from "../../enum/reference-type.enum";
import { NotificationType } from "../../enum/notification-type.enum";
import { SendStatus } from "../../enum/send-status.enum";
import { User } from "../../user/entities/user.entity";

@Entity('notification_log')
export class NotificationLog {
    @PrimaryGeneratedColumn()
    notification_log_id: number;

    @Column({ type: 'enum', enum: ReferenceType })
    reference_type: ReferenceType;

    @Column()
    reference_id: number;

    @Column({ type: 'enum', enum: NotificationType })
    notification_type: NotificationType;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    user_id: number;

    @Column()
    recipient: string;

    @Column({ type: 'enum', enum: SendStatus, default: SendStatus.QUEUED })
    send_status: SendStatus;

    @Column({ type: 'text', nullable: true })
    error_message: string;

    @Column({ type: 'int', default: 0 })
    retry_count: number;

    @Column({ type: 'timestamp with time zone', nullable: true })
    sent_at: Date;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;
}
