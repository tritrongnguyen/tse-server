import { ApiResponseDTO } from 'src/dtos';
import { User } from 'src/entities/user.entity';

export default class GetAllUsersResponseDTO implements ApiResponseDTO {
  constructor(
    statusCode: number,
    message: string,
    data: { users: Partial<User>[]; pageable: number },
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
  statusCode: number;
  message: string;
  data: {
    users: Partial<User>[];
    pageable: number;
  };
}
