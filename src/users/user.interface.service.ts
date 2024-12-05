import { PaginatedResponse } from 'src/dtos/common.dto';
import { ApproveLeftRequest } from 'src/dtos/users/requests/approve-left-request.dto';
import { ActivateUserRequest } from 'src/dtos/users/requests/approve-register-request.dto';
import { CreateUserRequest } from 'src/dtos/users/requests/create-user-request.dto';
import { SortDirections } from 'utils/constants';
import { User } from '../entities/user.entity';
export interface IUserService {
  getAllUsersPaginated(
    pageNum: number,
    pageSize: number,
    sortDirection: SortDirections,
    sortBy?: keyof User,
  ): Promise<PaginatedResponse<Partial<User>>>;

  getRegisterUsers(
    pageNum: number,
    pageSize: number,
    sortDirection: SortDirections,
    sortBy?: keyof User,
  ): Promise<PaginatedResponse<Partial<User>>>;

  getLeftRequest(): Promise<User[]>;

  createUser(createUser: CreateUserRequest): Promise<User>;

  checkUserIdExisted(userId: string): Promise<boolean>;

  checkEmailExisted(email: string): Promise<boolean>;

  findUserById(userId: string): Promise<User>;

  updateUser(user: User): Promise<User>;

  getUserInfoById(userId: string): Promise<User>;

  activateUser(activateUserRequest: ActivateUserRequest): Promise<boolean>;

  rejectUserRegistration(userIds: string[]): Promise<boolean>;
  
  approveLeftRequest(approveLeftRequest: ApproveLeftRequest): Promise<void>;

  requestLeft(userId: string): Promise<void>;

  getLeftRequestingUsers(): Promise<User[]>;
  
  rejectLeftRequestingUsers(userIds: string[]): Promise<void>;

  getUserById(userId: string): Promise<User>;

updatePassword(userId: string, oldPassword: string, newPassword: string): Promise<User>;

getUserByEmail(email: string): Promise<User>;

resetPassword(userId: string, newPassword: string): Promise<User>;

}
