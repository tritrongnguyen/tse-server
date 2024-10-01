import { User } from 'src/users/entities/user.entity';

export default class GetAllUsersResponseDTO {
  users: Partial<User>[];
}
