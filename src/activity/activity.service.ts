import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateActivityRequest } from '../dtos/activity/requests/create-activity-request.dto';
import { PaginatedQuery, PaginatedResponse } from '../dtos/common.dto';
import { Activity } from '../entities/activity.entity';
import { IActivityService } from './activity.interface.service';
import { SearchActivityRequest } from '../dtos/activity/requests/search-activity-request.dto';
import { User } from '../entities/user.entity';
import { UserActivity } from '../entities/user-activity.entity';

@Injectable()
export class ActivityService implements IActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(UserActivity)
    private userActivityRepository: Repository<UserActivity>,

    @InjectDataSource()
    private dataSource: DataSource,
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

  async searchActivityPaginated(
    searchRequest: SearchActivityRequest,
    paginationRequest: PaginatedQuery<Activity>,
  ): Promise<PaginatedResponse<Activity>> {
    const { page = 1, size = 10 } = paginationRequest;

    const startIndex = (page - 1) * size;

    const queryBuilder = this.activityRepository.createQueryBuilder('activity');
    queryBuilder.where('activity.isDeleted = :isDeleted', { isDeleted: false });
    if (searchRequest.searchText) {
      queryBuilder.andWhere('activity.name LIKE :searchText', {
        searchText: `%${searchRequest.searchText}%`,
      });
    }

    if (searchRequest.activityTypes && searchRequest.activityTypes.length > 0) {
      queryBuilder.andWhere('activity.activityType IN (:...activityTypes)', {
        activityTypes: searchRequest.activityTypes,
      });
    }

    if (searchRequest.sortBy) {
      queryBuilder.orderBy(`activity.${searchRequest.sortBy}`, 'DESC');
    } else {
      queryBuilder.orderBy('activity.createdAt', 'DESC');
    }

    const [data, count] = await queryBuilder
      .skip(startIndex)
      .take(size)
      .getManyAndCount();

    const pageable = Math.ceil(count / size);

    if (count < startIndex)
      return new PaginatedResponse<Activity>(pageable, count, []);
    else {
      return new PaginatedResponse<Activity>(pageable, count, data);
    }
  }

  async updateActivity(
    activityId: number,
    activityToUpdate: CreateActivityRequest,
  ): Promise<Activity> {
    const existedActivity = await this.activityRepository.findOneBy({
      activityId: activityId,
      isDeleted: false,
    });

    if (!existedActivity) {
      throw new NotFoundException(`Activity with ID ${activityId} not found`);
    }

    const noIdActivity: Partial<Activity> = {
      activityId: existedActivity.activityId,
      ...activityToUpdate,
    };

    return await this.activityRepository.save(noIdActivity);
  }

  async softDelete(activityId: number): Promise<void> {
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
  }

  async registerRequest(activityId: number, userId: string): Promise<void> {
    const activity = await this.activityRepository.findOneBy({
      activityId,
      isDeleted: false,
    });

    const userExist = await this.userRepository.exists({
      where: { userId },
    });

    if (!userExist) {
      throw new NotFoundException(`Không tìm thấy user với ID ${userId}`);
    }

    if (!activity) {
      throw new NotFoundException(
        `Không tồn tại hoạt động với ID ${activityId}`,
      );
    }

    // check if user already registered
    const isUserRegistered = await this.userActivityRepository
      .createQueryBuilder('ua')
      .where('ua.activity_id = :activityId', { activityId })
      .andWhere('ua.user_id = :userId', { userId })
      .getExists();

    if (isUserRegistered) {
      throw new ConflictException('User đã đăng ký hoạt động này');
    }

    // register user to activity
    await this.userActivityRepository.save({
      activity: { activityId },
      user: { userId },
    });

    // update registered number
    await this.activityRepository.update(
      { activityId },
      { registeredNumber: activity.registeredNumber + 1 },
    );
  }

  getRegisteredActivityOfUser(userId: string): Promise<Activity[]> {
    return this.activityRepository
      .createQueryBuilder('activity')
      .innerJoin('activity.userActivities', 'userActivities')
      .where('userActivities.user_id = :userId', { userId })
      .andWhere('activity.isDeleted = false')
      .getMany();
  }
}
