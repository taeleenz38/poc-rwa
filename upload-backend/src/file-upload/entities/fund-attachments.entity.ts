import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Attachments } from './attachments.entity';

@Entity()
export class FundAttachments {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  actualFileName: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateDate: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToOne(() => Attachments)
  @JoinColumn({ name: 'attachmentId' }) // Defines the foreign key column
  attachment: Attachments;

  @Column()
  attachmentId: number; // Explicit foreign key field

  @Column({ type: 'float', nullable: true })
  NavValue: number | null;
}
