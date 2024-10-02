import GetAllUsersResponseDTO from 'src/dtos/users/response/get-all-users-response.dto';
import { User } from './entities/user.entity';
import UpdateUserResponseDTO from 'src/dtos/users/response/update-user-response-dto';
import UpdateUserRequestDTO from 'src/dtos/users/requests/update-user-request-dto';
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

  updateUser(
    updateUserRequestDto: UpdateUserRequestDTO,
  ): Promise<UpdateUserResponseDTO>;

  getUserInfoById(userId: string): Promise<GetUserInfoByIdResponseDTO>;

  approveRegisterRequest(
    approveRegisterRequestDto: ApproveRegisterRequestDTO,
  ): Promise<void>;

  approveLeftRequest(
    approveLeftRequestDto: ApproveLeftRequestDTO,
  ): Promise<void>;
}
