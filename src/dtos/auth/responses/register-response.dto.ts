import { UserStatus } from 'src/auth/entities/enums/user-status.enum';
import { ApiResponseDTO } from 'src/dtos';

export class RegisterResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data: {
    userId: string;
    status: UserStatus;
  };
}
