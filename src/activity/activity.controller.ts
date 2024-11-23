import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { Routes, Services, SortDirections } from '../../utils/constants';
import { HttpExceptionFilter } from '../../utils/http-exception-filter';
import { Public } from '../auth/customs';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { CreateActivityRequest } from '../dtos/activity/requests/create-activity-request.dto';
import { GetActivityByIdResponse } from '../dtos/activity/responses/get-activity-by-id-response.dto';
import {
  ApiResponse,
  PaginatedQuery,
  PaginatedResponse,
} from '../dtos/common.dto';
import { Activity } from '../entities/activity.entity';
import { IActivityService } from './activity.interface.service';

@Controller(Routes.ACTIVITY)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class ActivityController {
  constructor(
    @Inject(Services.ACTIVITY)
    private activityService: IActivityService,
  ) {}

  @Public()
  @Get('')
  async getActivitiesPaginated(
    @Query() query: PaginatedQuery<Activity>,
  ): Promise<ApiResponse<PaginatedResponse<Activity>>> {
    const {
      page = 1,
      size = 10,
      sortBy = 'activityId',
      sortDirection = SortDirections.ASC,
    } = query;

    const pageable: PaginatedResponse<Activity> =
      await this.activityService.findAllActivitiesPaginated(
        page,
        size,
        sortBy,
        sortDirection,
      );

    return new ApiResponse(HttpStatus.OK, 'Activities found', pageable);
  }

  @Public()
  @Get(':activityId')
  async getActivityById(
    @Param('activityId', ParseIntPipe) activityId: number,
  ): Promise<ApiResponse<GetActivityByIdResponse>> {
    const activity: Activity =
      await this.activityService.findActivityById(activityId);

    return new ApiResponse(
      HttpStatus.OK,
      'Activity found',
      new GetActivityByIdResponse(activity),
    );
  }

  @Public()
  @Post('')
  async createActivity(
    @Body() createActivityRequest: CreateActivityRequest,
  ): Promise<ApiResponse<Partial<Activity>>> {
    const activity: Partial<Activity> =
      await this.activityService.createActivity(createActivityRequest);
    return new ApiResponse(
      HttpStatus.CREATED,
      'Activity created successfully',
      activity,
    );
  }

  @Public()
  @Delete(':activityId')
  async softDeleteActivity(
    @Param('activityId', ParseIntPipe) activityId: number,
  ): Promise<ApiResponse<void>> {
    let httpStatus: HttpStatus = HttpStatus.OK;
    let message: string = 'Activity deleted!';

    const isDeleted: boolean =
      await this.activityService.softDelete(activityId);

    if (!isDeleted) {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = `Internal server error while deleting activity with ID ${activityId}`;
    }

    return new ApiResponse(httpStatus, message);
  }
}
