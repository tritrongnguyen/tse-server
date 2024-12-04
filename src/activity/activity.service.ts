import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, Repository } from 'typeorm';
import { CreateActivityRequest } from '../dtos/activity/requests/create-activity-request.dto';
import { PaginatedQuery, PaginatedResponse } from '../dtos/common.dto';
import { Activity } from '../entities/activity.entity';
import { IActivityService } from './activity.interface.service';
import { SearchActivityRequest } from '../dtos/activity/requests/search-activity-request.dto';
import { User } from '../entities/user.entity';
import { UserActivity } from '../entities/user-activity.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ActivityStatus } from '../entities/enums/activity.enum';

@Injectable()
export class ActivityService implements IActivityService {
  private readonly LOGGER = new Logger(ActivityService.name);

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

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateActivityStatusCron(): Promise<void> {
    this.LOGGER.log('Daily update activity status');
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    this.LOGGER.log('Update activity to be open register');
    await this.activityRepository
      .createQueryBuilder()
      .update()
      .set({
        activityStatus: ActivityStatus.OPEN_NOW,
      })
      .where('time_open_register < :now', { now: startOfToday })
      .where('activity_status = :status', {
        status: ActivityStatus.IN_COMING,
      })
      .execute();

    this.LOGGER.log('Update activity to be close register');
    await this.activityRepository
      .createQueryBuilder()
      .update()
      .set({
        activityStatus: ActivityStatus.CLOSED,
      })
      .where('time_close_register < :now', { now: startOfToday })
      .andWhere('activity_status = (:status)', {
        status: ActivityStatus.OPEN_NOW,
      })
      .execute();

    this.LOGGER.log('Update activity to be finished');
    await this.activityRepository
      .createQueryBuilder()
      .update()
      .set({
        activityStatus: ActivityStatus.FINISHED,
      })
      .where('occur_date < :now', { now: startOfToday })
      .andWhere('activity_status = (:status)', {
        status: ActivityStatus.OPEN_NOW,
      })
      .execute();
  }

  getClosedActivities(): Promise<Activity[]> {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    return this.activityRepository.find({
      where: {
        timeCloseRegister: LessThan(startOfToday),
        isDeleted: false,
      },
    });
  }
  // get danh sách thành viên tham dự hoạt động
  async getParticipants(activityId: number): Promise<User[]> {
    const activity = await this.activityRepository.findOneBy({
      activityId,
      isDeleted: false,
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${activityId} not found`);
    }

    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.userActivities', 'userActivities')
      .where('userActivities.activity_id = :activityId', { activityId })
      .getMany();
  }
  // thống kê tất cả các hoạt động trong tháng
  async getActivitiesInMonth(month: number): Promise<Activity[]> {
    const startDate = new Date(new Date().getFullYear(), month - 1, 1);  // Ngày bắt đầu của tháng
    const endDate = new Date(new Date().getFullYear(), month, 0);  // Ngày cuối cùng của tháng
  
    const activities = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('activity.occurDate >= :startDate', { startDate: startDate.toISOString() })
      .andWhere('activity.occurDate <= :endDate', { endDate: endDate.toISOString() })
      .getMany();
  
    return activities;
  }
  // thống kê tất cả người đăng ký vào club trong tháng, trang thái status = active
  async getRegisteredUsersInMonth(month: number): Promise<User[]> {
    const startDate = new Date(new Date().getFullYear(), month - 1, 1);  // Ngày bắt đầu của tháng
    const endDate = new Date(new Date().getFullYear(), month, 0);  // Ngày cuối cùng của tháng
  
    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.status = :status', { status: 'active' })
      .andWhere('user.registerDate >= :startDate', { startDate: startDate.toISOString() })
      .andWhere('user.registerDate <= :endDate', { endDate: endDate.toISOString() })
      .getMany();
  
    return users;
  }
  // lọc ra danh sách người tham gia hoạt động tích cực nhất
    // Lấy danh sách top thành viên tham gia hoạt động tích cực nhất trong một tháng (mặc định là năm hiện tại)
    
  async getTopActiveUsersInMonth(month: number): Promise<User[]> {
    const currentYear = new Date().getFullYear(); // Năm hiện tại
    const startDate = new Date(currentYear, month - 1, 1); // Ngày đầu tiên của tháng
    const endDate = new Date(currentYear, month, 0); // Ngày cuối cùng của tháng
  
    // Query để lấy danh sách người dùng và số lượng hoạt động của họ trong tháng
    const users = await this.userActivityRepository
      .createQueryBuilder('userActivity')
      .innerJoin('userActivity.activity', 'activity') // Kết nối với bảng activity
      .innerJoin('userActivity.user', 'user') // Kết nối với bảng user
      .select('user.userId', 'userId') // Lấy ID của người dùng
      .addSelect('COUNT(userActivity.activity_id)', 'activityCount') // Đếm số lượng hoạt động
      .where('activity.occurDate >= :startDate', { startDate }) // Lọc theo ngày bắt đầu
      .andWhere('activity.occurDate <= :endDate', { endDate }) // Lọc theo ngày kết thúc
      .groupBy('user.userId') // Nhóm theo ID người dùng
      .orderBy('activityCount', 'DESC') // Sắp xếp theo số lượng hoạt động (giảm dần)
      .getRawMany();
  
    return users;
  }
    
  

  
  



}
