import { User } from 'src/entities/user.entity';

export class GetUserInfoByIdResponse {
  userInfo: Partial<User>;
  constructor(user: Partial<User>) {
    this.userInfo = user;
  }
}
