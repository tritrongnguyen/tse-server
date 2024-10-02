import { instanceToPlain } from 'class-transformer';
import { ApiResponseDTO } from 'src/dtos';
import { User } from 'src/entities/user.entity';

export default class GetRegisterUsersResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data?: any;

  constructor(statusCode?: number, message?: string, data?: User[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data?.map((user) => instanceToPlain(user));
  }
}
