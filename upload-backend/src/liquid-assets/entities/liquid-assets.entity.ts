import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity() // Table name in the database
export class LiquidAssets {
  @PrimaryGeneratedColumn()
  id: number; // Auto-incrementing primary key

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalDailyLiquidAssets: number; // Total Value of Daily Liquid Assets

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  totalWeeklyLiquidAssets: number; // Total Value of Weekly Liquid Assets

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentageDailyLiquidAssets: number; // Percentage of Total Assets in Daily Liquid Assets

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  percentageWeeklyLiquidAssets: number; // Percentage of Total Assets in Weekly Liquid Assets

  @Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    nullable: false,
  })
  TotalAssetsValue: number; // Total Assets Value

  @Column({ type: 'timestamptz', nullable: true })
  date: Date; // Date of the record

  @CreateDateColumn({ type: 'timestamptz' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateDate: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
