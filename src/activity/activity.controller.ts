import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
import { SearchActivityRequest } from '../dtos/activity/requests/search-activity-request.dto';
import { RegisterActivityRequest } from '../dtos/activity/requests/register-activity.request.dto';

@Controller(Routes.ACTIVITY)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class ActivityController {
  constructor(
    @Inject(Services.ACTIVITY)
    private activityService: IActivityService,
  ) {}

  @Get('')
  @Public()
  async getCloseActivities(): Promise<Activity[]> {
    return this.activityService.getClosedActivities();
  }

  @Public()
  @Post('/list')
  async searchActivityPaginated(
    @Query() query: PaginatedQuery<Activity>,
    @Body() searchActivityRequest: SearchActivityRequest,
  ): Promise<ApiResponse<PaginatedResponse<Activity>>> {
    const pageable: PaginatedResponse<Activity> =
      await this.activityService.searchActivityPaginated(
        searchActivityRequest,
        query,
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
    await this.activityService.softDelete(activityId);
    return new ApiResponse(HttpStatus.OK, 'ok be iu');
  }

  @Public()
  @Put(':activityId')
  @HttpCode(HttpStatus.OK)
  async updateActivity(
    @Param('activityId', ParseIntPipe) activityId: number,
    @Body() updateActivityRequest: CreateActivityRequest,
  ): Promise<ApiResponse<any>> {
    const activityUpdated = await this.activityService.updateActivity(
      activityId,
      updateActivityRequest,
    );
    return new ApiResponse(
      HttpStatus.OK,
      'Update successfully',
      activityUpdated,
    );
  }

  @Public()
  @Post('/register')
  async registerActivity(
    @Body() registerActivityRequest: RegisterActivityRequest,
  ): Promise<ApiResponse<any>> {
    console.log({ registerActivityRequest });
    const { activityId, userId } = registerActivityRequest;
    await this.activityService.registerRequest(activityId, userId);

    return new ApiResponse(HttpStatus.OK, 'Register successfully');
  }

  @Public()
  @Get('/registered/:userId')
  async getRegisteredActivities(
    @Param('userId') userId: string,
  ): Promise<ApiResponse<Activity[]>> {
    const result =
      await this.activityService.getRegisteredActivityOfUser(userId);
    return new ApiResponse(
      HttpStatus.OK,
      'Get All Registered Activities',
      result,
    );
  }

   // get danh sách thành viên tham dự hoạt động
  @Public()
  @Get(':activityId/participants')
  async getParticipants(
    @Param('activityId', ParseIntPipe) activityId: number,
  ): Promise<ApiResponse<any>> {
    const result = await this.activityService.getParticipants(activityId);
    return new ApiResponse(HttpStatus.OK, 'Get all participants', result);
  }
}
