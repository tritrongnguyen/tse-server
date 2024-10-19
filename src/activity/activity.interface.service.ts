import { CreateActivityRequest } from 'src/dtos/activity/requests/create-activity-request.dto';
import { GetAllActivitiesPaginatedResponse } from 'src/dtos/activity/responses/get-all-activities-paginated-response.dto';
import { Activity } from 'src/entities/activity.entity';

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
  ): Promise<GetAllActivitiesPaginatedResponse>;
  updateActivity(activity: Activity): Promise<Activity>;
  deleteActivity(activityId: number): Promise<Activity>;
}
