import { ApiResponseDTO } from 'src/dtos';
import { Group } from 'src/entities/group.entity';

export class GetGroupInfoResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data?: Partial<Group>;

  constructor(statusCode: number, message: string, data?: Partial<Group>) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
