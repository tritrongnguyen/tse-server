import GetAllUsersResponseDTO from 'src/dtos/users/response/get-all-users-response.dto';
import { CreateUserDTO } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import UpdateUserResponseDTO from 'src/dtos/users/response/update-user-response-dto';
import UpdateUserRequestDTO from 'src/dtos/users/requests/update-user-request-dto';
import { SortDirections } from 'utils/constants';
export interface IUserService {
  getAllUsersPaginated(
    pageNum: number,
    pageSize: number,
    sortDirection: SortDirections,
    sortBy?: keyof User,
  ): Promise<GetAllUsersResponseDTO>;
  createUser(createUserDTO: CreateUserDTO): Promise<User>;
  checkUserIdExisted(userId: string): Promise<boolean>;
  checkEmailExisted(email: string): Promise<boolean>;
  findUserById(userId: string): Promise<User>;
  updateUser(
    updateUserRequestDto: UpdateUserRequestDTO,
  ): Promise<UpdateUserResponseDTO>;
}
