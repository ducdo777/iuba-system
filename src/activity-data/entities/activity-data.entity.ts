import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { User } from '../../users/entities/user.entity';

@Entity('activity_data')
export class ActivityData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  teamId: string;

  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'int', default: 0 })
  donThuan: number;

  @Column({ type: 'int', default: 0 })
  huuHieu: number;

  @Column({ type: 'int', default: 0 })
  baptem: number;

  @Column({ type: 'int', default: 0 })
  thoPhuong: number;

  @Column({ type: 'int', default: 0 })
  lapCLB: number;

  @Column({ type: 'int', default: 0 })
  lenGiaiDoan: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
