import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActivityRequest } from '../dtos/activity/requests/create-activity-request.dto';
import { PaginatedResponse } from '../dtos/common.dto';
import { Activity } from '../entities/activity.entity';
import { IActivityService } from './activity.interface.service';

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
      name,
      description,
      venue,
      startTime,
      timeCloseRegister,
      activityScope,
      activityStatus,
      activityType,
      venueType,
      timeOpenRegister,
      hostName,
      endTime,
      capacity,
      registeredNumber,
      occurDate,
    } = createActivityRequest;

    // find whether the activity is already exist or not
    const isExist = await this.activityRepository.exists({
      where: { name, isDeleted: false },
    });

    if (isExist) {
      throw new ConflictException('Activity already exist!');
    }
    // create activity
    const activity = new Activity(
      name,
      description,
      hostName,
      capacity,
      registeredNumber,
      timeOpenRegister,
      timeCloseRegister,
      occurDate,
      startTime,
      endTime,
      venue,
      venueType,
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
      isDeleted: false,
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${activityId} not found`);
    }

    return activity;
  }

  async findAllActivitiesPaginated(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
  ): Promise<PaginatedResponse<Activity>> {
    const startIndex = (page - 1) * size;

    const [data, count] = await this.activityRepository.findAndCount({
      where: { isDeleted: false },
      skip: startIndex,
      take: size,
      order: {
        [sortBy]: sortDirection,
      },
    });
    const pageable = Math.ceil(count / size);

    if (count < startIndex)
      return new PaginatedResponse<Activity>(pageable, count, []);
    else {
      return new PaginatedResponse<Activity>(pageable, count, data);
    }
  }

  async updateActivity(activity: Activity): Promise<Activity> {
    const existedActivity = await this.activityRepository.findOneBy({
      activityId: activity.activityId,
      isDeleted: false,
    });

    if (!existedActivity) {
      throw new NotFoundException(
        `Activity with ID ${activity.activityId} not found`,
      );
    }
    console.log('found');
    return;
  }

  async softDelete(activityId: number): Promise<boolean> {
    const result = await this.activityRepository.update(
      {
        activityId,
        isDeleted: false,
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException(`Activity with ID ${activityId} not found`);
    }
    return true;
  }
}
