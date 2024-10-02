import { ApiResponseDTO } from 'src/dtos';
import { User } from 'src/entities/user.entity';

export class GetLeftRequestsResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data?: User[];

  constructor(statusCode: number, message: string, data?: User[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
