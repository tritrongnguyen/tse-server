import { DataSource, Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { IAttendanceService } from './attendance.interface.service';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Attendance } from '../entities/attendance.entity';

@Injectable()
export class AttendanceService implements IAttendanceService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,

    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async getAttendanceByActivityId(activityId: number): Promise<Attendance> {
    return this.attendanceRepository.findOne({
      where: {
        activity: {
          activityId: activityId,
        },
      },
    });
  }
}
