import { Injectable } from '@nestjs/common';
import { IActivityService } from './activity.interface.service';
import { CreateActivityRequestDTO } from 'src/dtos/activity/requests/create-activity-request.dto';
import { CreateActivityResponseDTO } from 'src/dtos/activity/responses/create-activity-response.dto';

@Injectable()
export class ActivityService implements IActivityService {
  createActivity(
    createActivityRequest: CreateActivityRequestDTO,
  ): Promise<CreateActivityResponseDTO> {
    throw new Error('Method not implemented.');
  }
}
