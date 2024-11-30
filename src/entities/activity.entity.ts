import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {
  ActivityScope,
  ActivityStatus,
  ActivityType,
  VenueTypes,
} from './enums/activity.enum';
import { UserActivity } from './user-activity.entity';
import { Attendance } from './attendance.entity';
import { BaseEntity } from './base.entity';

@Entity({
  name: 'activities',
})
export class Activity extends BaseEntity {
  constructor(
    name: string,
    description: string,
    hostName: string,
    capacity: number,
    registeredNumber: number,
    timeOpenRegister: Date,
    timeCloseRegister: Date,
    occurDate: Date,
    startTime: string,
    endTime: string,
    venue: string,
    venueType?: VenueTypes,
    activityType?: ActivityType,
    activityStatus?: ActivityStatus,
    activityScope?: ActivityScope,
  ) {
    super();
    this.name = name;
    this.description = description;
    this.capacity = capacity;
    this.hostName = hostName;
    this.registeredNumber = registeredNumber;

    this.timeOpenRegister = timeOpenRegister;
    this.timeCloseRegister = timeCloseRegister;
    this.occurDate = occurDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.venue = venue;
    this.activityType = activityType;
    this.activityStatus = activityStatus;
    this.activityScope = activityScope;
    this.venueType = venueType;
  }

  @PrimaryGeneratedColumn('increment', {
    name: 'activity_id',
    type: 'bigint',
  })
  activityId: number;

  @Column('nvarchar', {
    length: 255,
    nullable: false,
  })
  name: string;

  @Column('text', {
    nullable: false,
  })
  description: string;

  @Column('int', {
    nullable: false,
    default: 3,
    name: 'capacity',
  })
  capacity: number;

  @Column('int', {
    name: 'registered_number',
    default: 0,
  })
  registeredNumber: number;

  @Column('date', {
    name: 'time_open_register',
    nullable: false,
  })
  timeOpenRegister: Date;

  @Column('date', {
    name: 'time_close_register',
    nullable: false,
  })
  timeCloseRegister: Date;

  @Column('nvarchar', {
    length: 100,
    name: 'host_name',
    nullable: false,
  })
  hostName: string;

  @Column('date', {
    name: 'occur_date',
    nullable: false,
  })
  occurDate: Date;

  @Column('time', {
    name: 'start_time',
    nullable: false,
  })
  startTime: string;

  @Column('time', {
    name: 'end_time',
    nullable: false,
  })
  endTime: string;

  @Column('nvarchar', {
    length: 255,
    nullable: false,
  })
  venue: string;

  @Column('enum', {
    enum: VenueTypes,
    default: VenueTypes.OFFLINE,
    name: 'venue_type',
  })
  venueType: string;

  @Column('enum', {
    enum: ActivityType,
    default: ActivityType.SEMINAR,
    name: 'activity_type',
  })
  activityType: ActivityType;

  @Column('enum', {
    enum: ActivityStatus,
    default: ActivityStatus.PLANED,
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
