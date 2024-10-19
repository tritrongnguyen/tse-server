import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IActivityService } from './activity.interface.service';
import { CreateActivityRequest } from 'src/dtos/activity/requests/create-activity-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/entities/activity.entity';
import { Repository } from 'typeorm';
import { GetAllActivitiesPaginatedResponse } from 'src/dtos/activity/responses/get-all-activities-paginated-response.dto';

@Injectable()
export class ActivityService implements IActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
  ) {}

  async createActivity(
    createActivityRequest: CreateActivityRequest,
  ): Promise<Activity> {
    const {
      title,
      description,
      venue,
      limitPeople,
      startTime,
      timeCloseRegister,
      activityScope,
      activityStatus,
      activityType,
      timeOpenRegister,
    } = createActivityRequest;

    // find whether the activity is already exist or not
    const isExist = await this.activityRepository.exists({ where: { title } });
    if (isExist) {
      throw new ConflictException('Activity already exist!');
    }
    // create activity
    const activity = new Activity(
      title,
      description,
      limitPeople,
      timeOpenRegister,
      timeCloseRegister,
      startTime,
      venue,
      activityType,
      activityStatus,
      activityScope,
    );

    // send invite request to all user aka specific users

    return await this.activityRepository.save(activity);
  }

  async findActivityById(activityId: number): Promise<Activity> {
    const activity: Activity = await this.activityRepository.findOneBy({
      activityId,
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${activityId} not found`);
    }

    return activity;
  }

  findAllActivitiesPaginated(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
  ): Promise<GetAllActivitiesPaginatedResponse> {
    return;
  }

  updateActivity(activity: Activity): Promise<Activity> {
    throw new Error('Method not implemented.');
  }
  deleteActivity(activityId: number): Promise<Activity> {
    throw new Error('Method not implemented.');
  }
}
