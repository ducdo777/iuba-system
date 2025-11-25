import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('activity_point_config')
export class ActivityPointConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  activityType: 'donThuan' | 'huuHieu' | 'baptem' | 'thoPhuong' | 'lapCLB' | 'lenGiaiDoan' | 'hiepCauNguyenSang';

  @Column({ type: 'varchar' })
  activityName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pointPerUnit: number;

  @Column({ type: 'varchar', default: 'active' })
  status: 'active' | 'inactive';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

