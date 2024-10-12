import { Group } from 'src/entities/group.entity';
import { ApiResponseDTO } from '../..';

export class GetGroupsByPartialNameResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data?: Partial<Group>[];

  constructor(statusCode: number, message: string, data?: Partial<Group>[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
