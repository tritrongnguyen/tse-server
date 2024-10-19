import { instanceToPlain } from 'class-transformer';
import { User } from 'src/entities/user.entity';

export default class GetRegisterUsersResponse {
  users?: Partial<User>[];

  constructor(users: User[]) {
    this.users = users.map((user) => instanceToPlain(user));
  }
}
