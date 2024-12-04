import { User } from 'src/entities/user.entity';
import { CreateActivityRequest } from '../dtos/activity/requests/create-activity-request.dto';
import { SearchActivityRequest } from '../dtos/activity/requests/search-activity-request.dto';
import { PaginatedQuery, PaginatedResponse } from '../dtos/common.dto';
import { Activity } from '../entities/activity.entity';

export interface IActivityService {
  createActivity(
    createActivityRequest: CreateActivityRequest,
  ): Promise<Activity>;

  findActivityById(activityId: number): Promise<Activity>;

  searchActivityPaginated(
    searchRequest: SearchActivityRequest,
    paginationRequest: PaginatedQuery<Activity>,
  ): Promise<PaginatedResponse<Activity>>;
  updateActivity(
    activityId: number,
    activityToUpdate: CreateActivityRequest,
  ): Promise<Activity>;
  softDelete(activityId: number): Promise<void>;

  registerRequest(activityId: number, userId: string): Promise<void>;

  getRegisteredActivityOfUser(userId: string): Promise<Activity[]>;

  updateActivityStatusCron(): Promise<void>;

  getClosedActivities(): Promise<Activity[]>;

  getParticipants(activityId: number): Promise<User[]>;
  getActivitiesInMonth(month: number): Promise<Activity[]>;
  getRegisteredUsersInMonth(month: number): Promise<User[]>;

  getTopActiveUsersInMonth(month: number): Promise<User[]>;
  

}
