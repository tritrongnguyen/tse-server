import { CreateActivityRequest } from '../dtos/activity/requests/create-activity-request.dto';
import { PaginatedResponse } from '../dtos/common.dto';
import { Activity } from '../entities/activity.entity';

export interface IActivityService {
  createActivity(
    createActivityRequest: CreateActivityRequest,
  ): Promise<Activity>;

  findActivityById(activityId: number): Promise<Activity>;

  findAllActivitiesPaginated(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
  ): Promise<PaginatedResponse<Activity>>;
  updateActivity(activity: Activity): Promise<Activity>;
  softDelete(activityId: number): Promise<boolean>;
}
