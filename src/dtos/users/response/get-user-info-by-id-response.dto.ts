import { ApiResponseDTO } from 'src/dtos';
import { User } from 'src/users/entities/user.entity';

export class GetUserInfoByIdResponseDTO implements ApiResponseDTO {
  constructor(statusCode: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  statusCode: number;
  message: string;
  data?: any;
}
