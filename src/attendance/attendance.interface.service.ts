import { Attendance } from '../entities/attendance.entity';

export interface IAttendanceService {
  getAttendanceByActivityId(activityId: number): Promise<Attendance>;
}
