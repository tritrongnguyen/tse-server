import {
  Body,
  Controller,
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
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { Activity } from 'src/entities/activity.entity';
import { Routes, Services, SortDirections } from 'utils/constants';
import { HttpExceptionFilter } from 'utils/http-exception-filter';
import { IActivityService } from './activity.interface.service';
import { CreateActivityRequest } from 'src/dtos/activity/requests/create-activity-request.dto';
import { Public } from 'src/auth/customs';
import { CreateActivityResponse } from 'src/dtos/activity/responses/create-activity-response.dto';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { GetActivityByIdResponse } from 'src/dtos/activity/responses/get-activity-by-id-repsonse.dto';
import { GetAllActivitiesPaginatedResponse } from 'src/dtos/activity/responses/get-all-activities-paginated-response.dto';
import {
  ApiResponse,
  PaginatedQuery,
  PaginatedResponse,
} from 'src/dtos/common.dto';

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
  ): Promise<
    ApiResponse<PaginatedResponse<GetAllActivitiesPaginatedResponse>>
  > {
    const {
      page = 1,
      size = 10,
      sortBy = 'activityId',
      sortDirection = SortDirections.ASC,
    } = query;

    console.log(page, size, sortBy, sortDirection);

    return new ApiResponse(HttpStatus.OK, 'Activities found', null);
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
  ): Promise<ApiResponse<CreateActivityResponse>> {
    const activity: Activity = await this.activityService.createActivity(
      createActivityRequest,
    );
    return new ApiResponse(
      HttpStatus.CREATED,
      'Activity created',
      new CreateActivityResponse(activity),
    );
  }
}
