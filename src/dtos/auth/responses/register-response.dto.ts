import { UserStatus } from 'src/auth/entities/enums/user-status.enum';

export default class RegisterResponseDTO {
  userId: string;
  status: UserStatus;
}
