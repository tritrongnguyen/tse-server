import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {
  ActivityScope,
  ActivityStatus,
  ActivityType,
} from './enums/activity.enum';
import { UserActivity } from './user-activity.entity';
import { Attendance } from './attendance.entity';

@Entity({
  name: 'activities',
})
export class Activity {
  @PrimaryGeneratedColumn('increment', {
    name: 'activity_id',
    type: 'bigint',
  })
  activityId: number;

  @Column('nvarchar', {
    length: 255,
    nullable: false,
    unique: true,
  })
  title: string;

  @Column('text', {
    nullable: false,
  })
  description: string;

  @Column('int', {
    nullable: false,
    default: 3,
    name: 'limit_people',
  })
  limitPeople: number;

  @Column('datetime', {
    name: 'time_open_register',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  timeOpenRegister: Date;

  @Column('datetime', {
    name: 'time_close_register',
    nullable: false,
  })
  timeCloseRegister: Date;

  @Column('datetime', {
    name: 'start_time',
    nullable: false,
  })
  startTime: Date;

  @Column('nvarchar', {
    length: 255,
    nullable: false,
  })
  venue: string;

  @Column('enum', {
    enum: ActivityType,
    default: ActivityType.SEMINAR,
    name: 'activity_type',
  })
  activityType: ActivityType;

  @Column('enum', {
    enum: ActivityStatus,
    default: ActivityStatus.PLAN,
    name: 'activity_status',
  })
  activityStatus: ActivityStatus;

  @Column('enum', {
    enum: ActivityScope,
    default: ActivityScope.INTERNAL,
    name: 'activity_scope',
  })
  activityScope: ActivityScope;

  @OneToMany(() => UserActivity, (userActivity) => userActivity.activity)
  userActivities: Promise<UserActivity[]>;

  @OneToMany(() => Attendance, (attendance) => attendance.activity, {
    cascade: true,
  })
  attendance: Attendance;
}
