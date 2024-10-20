import { PaginatedResponse } from 'src/dtos/common.dto';
import { User } from '../entities/user.entity';
import { SortDirections } from 'utils/constants';
import { CreateUserRequest } from 'src/dtos/users/requests/create-user-request.dto';
import { ApproveRegisterRequest } from 'src/dtos/users/requests/approve-register-request.dto';
import { ApproveLeftRequest } from 'src/dtos/users/requests/approve-left-request.dto';
export interface IUserService {
  getAllUsersPaginated(
    pageNum: number,
    pageSize: number,
    sortDirection: SortDirections,
    sortBy?: keyof User,
  ): Promise<PaginatedResponse<Partial<User>>>;

  getRegisterUsers(): Promise<User[]>;

  getLeftRequest(): Promise<User[]>;

  createUser(createUser: CreateUserRequest): Promise<User>;

  checkUserIdExisted(userId: string): Promise<boolean>;

  checkEmailExisted(email: string): Promise<boolean>;

  findUserById(userId: string): Promise<User>;

  updateUser(user: User): Promise<User>;

  getUserInfoById(userId: string): Promise<User>;

  approveRegisterRequest(
    approveRegisterRequest: ApproveRegisterRequest,
  ): Promise<boolean>;

  approveLeftRequest(approveLeftRequest: ApproveLeftRequest): Promise<void>;
}
