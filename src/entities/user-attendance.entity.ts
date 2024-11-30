// import { Expose } from 'class-transformer';
// import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
// import { Attendance } from './attendance.entity';
// import { User } from './user.entity';

// @Entity({
//   name: 'user_attendance',
// })
// export class UserAttendance {
//   @PrimaryColumn('bigint', {
//     name: 'group_id',
//   })
//   @ManyToOne(() => Attendance, (attendance) => attendance.userAttendances)
//   @JoinColumn({ name: 'attendance_id' })
//   @Expose({ name: 'attendance_id' })
//   attendance: Attendance;

//   @PrimaryColumn('varchar', {
//     length: 10,
//     name: 'user_id',
//   })
//   @ManyToOne(() => User, (user) => user.groupMembers)
//   @JoinColumn({ name: 'user_id' })
//   @Expose({ name: 'user_id' })
//   member: User;
// }
