import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
export interface IUserService {
  createUser(createUserDTO: CreateUserDTO): Promise<User>;
  checkUserIdExisted(userId: string): Promise<boolean>;
  checkEmailExisted(email: string): Promise<boolean>;
  findUserById(userId: string): Promise<User>;
}
