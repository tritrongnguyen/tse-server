import { User } from '../entities/user.entity';
import { SortDirections } from 'utils/constants';
import { GetUserInfoByIdResponseDTO } from 'src/dtos/users/response/get-user-info-by-id-response.dto';
import { CreateUserRequestDTO } from 'src/dtos/users/requests/create-user-request.dto';
import { ApproveRegisterRequestDTO } from 'src/dtos/users/requests/approve-register-request.dto';
import { ApproveLeftRequestDTO } from 'src/dtos/users/requests/approve-left-request.dto';
export interface IUserService {
  getAllUsersPaginated(
    pageNum: number,
    pageSize: number,
    sortDirection: SortDirections,
    sortBy?: keyof User,
  ): Promise<{
    users: User[];
    pageable: number;
  }>;

  getRegisterUsers(): Promise<User[]>;

  getLeftRequest(): Promise<User[]>;

  createUser(createUserDTO: CreateUserRequestDTO): Promise<User>;

  checkUserIdExisted(userId: string): Promise<boolean>;

  checkEmailExisted(email: string): Promise<boolean>;

  findUserById(userId: string): Promise<User>;

  updateUser(user: User): Promise<User>;

  getUserInfoById(userId: string): Promise<GetUserInfoByIdResponseDTO>;

  approveRegisterRequest(
    approveRegisterRequestDto: ApproveRegisterRequestDTO,
  ): Promise<boolean>;

  approveLeftRequest(
    approveLeftRequestDto: ApproveLeftRequestDTO,
  ): Promise<void>;
}
