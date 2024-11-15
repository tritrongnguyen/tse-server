import { Attendance } from '../../../entities/attendance.entity';

export class GetAttendanceResponse {
  attendance: Partial<Attendance>;
  constructor(attendance: Partial<Attendance>) {
    this.attendance = attendance;
  }
}
