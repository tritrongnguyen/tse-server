import { ApiResponseDTO } from 'src/dtos';
import { UserStatus } from 'src/entities/enums/user-status.enum';

export class RegisterResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data: {
    userId: string;
    status: UserStatus;
  };

  constructor(
    statusCode?: number,
    message?: string,
    data?: {
      userId: string;
      status: UserStatus;
    },
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
