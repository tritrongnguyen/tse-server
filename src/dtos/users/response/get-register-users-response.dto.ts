import { ApiResponseDTO } from 'src/dtos';
import { User } from 'src/users/entities/user.entity';

export default class GetRegisterUsersResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data?: User[];

  constructor(statusCode?: number, message?: string, data?: User[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
