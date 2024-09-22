import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({
  name: 'login_logs',
})
export class LoginLog {
  @PrimaryGeneratedColumn('identity', {
    type: 'bigint',
    name: 'id',
  })
  public logId: number;

  @ManyToOne(() => User, (user) => user.loginLogs)
  @JoinColumn({
    name: 'user_id',
  })
  public user: User;

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    name: 'login_time',
    nullable: false,
  })
  public loginTime: Date;

  @Column('datetime', {
    default: () => 'CURRENT_TIMESTAMP',
    name: 'logout_time',
    nullable: false,
  })
  public logoutTime: Date;

  @Column('nvarchar', {
    length: 250,
    default: '',
    nullable: false,
  })
  public notes: string;
}
