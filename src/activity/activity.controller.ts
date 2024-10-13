import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { Activity } from 'src/entities/activity.entity';
import { Repository } from 'typeorm';
import { Routes, Services } from 'utils/constants';
import { HttpExceptionFilter } from 'utils/http-exception-filter';
import { IActivityService } from './activity.interface.service';
import { CreateActivityRequestDTO } from 'src/dtos/activity/requests/create-activity-request.dto';
import { Public } from 'src/auth/customs';

@Controller(Routes.ACTIVITY)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class ActivityController {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,

    @Inject(Services.ACTIVITY)
    private activityService: IActivityService,
  ) {}

  @Public()
  @Get('')
  async getActivitiesPaginated() {
    return 'Get all activities paginated';
  }

  @Public()
  @Post('')
  async createActivity(
    @Body() createActivityRequest: CreateActivityRequestDTO,
  ) {
    return createActivityRequest;
  }
}
