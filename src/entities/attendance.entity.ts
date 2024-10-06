import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AttendanceStatus } from './enums/attendance.enum';

@Entity({ name: 'attendances' })
export class Attendance {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    name: 'attendance_id',
  })
  attendanceId: number;

  @Column('int', {
    nullable: false,
  })
  point: number;

  @Column('datetime', {
    nullable: false,
    name: 'open_time',
  })
  openTime: Date;

  @Column('datetime', {
    nullable: false,
    name: 'close_time',
  })
  closeTime: Date;

  @Column('int', {
    name: 'present_num',
    nullable: false,
  })
  presentNum: number;

  @Column('int', {
    name: 'absent_num',
    nullable: false,
  })
  absentNum: number;

  @Column('int', {
    name: 'late_num',
    nullable: false,
  })
  lateNum: number;

  @Column('int', {
    name: 'not_internal_num',
    nullable: false,
  })
  notInternalNum: number;

  @Column('enum', {
    enum: AttendanceStatus,
    default: AttendanceStatus.PENDING,
    name: 'attendance_status',
  })
  attendanceStatus: AttendanceStatus;
}
