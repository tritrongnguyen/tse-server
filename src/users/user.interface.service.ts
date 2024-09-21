import { User } from './entities/user.entity';
export interface IUserService {
  createUser(user: User): Promise<User>;
}
