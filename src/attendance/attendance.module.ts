import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from '../../utils/constants';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance])],
  controllers: [AttendanceController],
  providers: [
    {
      provide: Services.ATTENDANCE,
      useClass: AttendanceService,
    },
  ],
})
export class AttendanceModule {}
