import { CreateActivityRequestDTO } from 'src/dtos/activity/requests/create-activity-request.dto';
import { CreateActivityResponseDTO } from 'src/dtos/activity/responses/create-activity-response.dto';

export interface IActivityService {
  createActivity(
    createActivityRequest: CreateActivityRequestDTO,
  ): Promise<CreateActivityResponseDTO>;
}
