import GetAllUsersResponseDTO from 'src/dtos/users/response/get-all-users-response.dto';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
export interface IUserService {
  getAllUsers(): Promise<GetAllUsersResponseDTO>;
  createUser(createUserDTO: CreateUserDTO): Promise<User>;
  checkUserIdExisted(userId: string): Promise<boolean>;
  checkEmailExisted(email: string): Promise<boolean>;
  findUserById(userId: string): Promise<User>;
}
