import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { IAttendanceService } from './attendance.interface.service';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { HttpExceptionFilter } from '../../utils/http-exception-filter';
import { Public } from '../auth/customs';
import { ApiResponse } from '../dtos/common.dto';
import { GetAttendanceResponse } from '../dtos/attendances/responses/get-attendance-response.dto';

@Controller(Routes.ATTENDANCE)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class AttendanceController {
  constructor(
    @Inject(Services.ATTENDANCE) private attendanceService: IAttendanceService,
  ) { }

  @Public()
  @Get(':activityId')
  async getAttendanceByActivityId(
    @Param('activityId', ParseIntPipe) activityId: number,
  ): Promise<ApiResponse<GetAttendanceResponse>> {
    const attendance =
      await this.attendanceService.getAttendanceByActivityId(activityId);

    return new ApiResponse<GetAttendanceResponse>(
      HttpStatus.OK,
      `Attendance for activity ${activityId} retrieved successfully`,
      new GetAttendanceResponse(attendance),
    );
  }
}
