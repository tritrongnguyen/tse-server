import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Activity } from './activity.entity';
import { UserActivityStatus } from './enums/user-activity.enum';

@Entity({
  name: 'user_activity',
})
export class UserActivity {
  @PrimaryColumn('bigint', {
    name: 'user_id',
  })
  @ManyToOne(() => User, (user) => user.userActivities)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @PrimaryColumn('bigint', {
    name: 'activity_id',
  })
  @ManyToOne(() => Activity, (activity) => activity.userActivities)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @Column('enum', {
    enum: UserActivityStatus,
    default: UserActivityStatus.REGISTERED,
  })
  status: UserActivityStatus;
}
