import { ApiResponseDTO } from 'src/dtos';
import { Activity } from 'src/entities/activity.entity';

export class CreateActivityResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data?: Partial<Activity>;

  constructor(statusCode: number, message: string, data?: Partial<Activity>) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
