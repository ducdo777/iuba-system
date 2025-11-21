import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ActivityData } from '../../activity-data/entities/activity-data.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  teamCode: string;

  @Column()
  teamName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'varchar', default: 'active' })
  status: 'active' | 'inactive';

  @OneToMany(() => User, user => user.team)
  users: User[];

  @OneToMany(() => ActivityData, activityData => activityData.team)
  activityData: ActivityData[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

