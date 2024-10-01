import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { IUserService } from './user.interface.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import GetAllUsersResponseDTO from 'src/dtos/users/response/get-all-users-response.dto';
import UpdateUserResponseDTO from 'src/dtos/users/response/update-user-response-dto';
import UpdateUserRequestDTO from 'src/dtos/users/requests/update-user-request-dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { SortDirections } from 'utils/constants';
import { GetUserInfoByIdResponseDTO } from 'src/dtos/users/response/get-user-info-by-id-response.dto';
import { CreateUserRequestDTO } from 'src/dtos/users/requests/create-user-request.dto';
import { UserStatus } from 'src/auth/entities/enums/user-status.enum';
import ApproveRegisterRequestDTO from 'src/dtos/users/requests/approve-user-register-request.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUserInfoById(userId: string): Promise<GetUserInfoByIdResponseDTO> {
    const userFound = await this.userRepository.findOne({
      where: { userId },
    });

    if (!userFound)
      throw new NotFoundException(`User with this ID ${userId} not found`);

    return new GetUserInfoByIdResponseDTO(
      HttpStatus.OK,
      'User found!',
      instanceToPlain(userFound),
    );
  }

  async getAllUsersPaginated(
    pageNum: number,
    pageSize: number,
    sortDirection: SortDirections,
    sortBy?: keyof User,
  ): Promise<{
    users: User[];
    pageable: number;
  }> {
    const startIndex = (pageNum - 1) * pageSize;

    const [data, count] = await this.userRepository.findAndCount({
      skip: startIndex,
      take: pageSize,
      order: {
        [sortBy]: sortDirection,
      },
    });
    const pageable = Math.ceil(count / pageSize);

    if (count < startIndex)
      return {
        users: [],
        pageable: 0,
      };
    else {
      return {
        users: data,
        pageable,
      };
    }
  }

  async createUser(createUserDTO: CreateUserRequestDTO): Promise<User> {
    return await this.userRepository.save(
      new User(
        createUserDTO.userId,
        createUserDTO.hashedPassword,
        createUserDTO.firstName,
        createUserDTO.lastName,
        createUserDTO.email,
        createUserDTO.status,
      ),
    );
  }

  async updateUser(
    updateUserRequestDTO: UpdateUserRequestDTO,
  ): Promise<UpdateUserResponseDTO> {
    await this.userRepository.save(updateUserRequestDTO.user);
    const result = new UpdateUserResponseDTO();
    result.statusCode = HttpStatus.OK;
    result.message = 'Updated';
    return result;
  }

  async checkEmailExisted(email: string): Promise<boolean> {
    return await this.userRepository.exists({
      where: { email: email },
    });
  }

  async checkUserIdExisted(userId: string): Promise<boolean> {
    return await this.userRepository.exists({
      where: { userId: userId },
    });
  }

  async findUserById(userId: string): Promise<User> {
    return await this.userRepository.findOne({
      where: {
        userId: userId,
      },
    });
  }

  async getRegisterUsers(): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        status: UserStatus.PENDING_APPROVAL,
      },
      order: {
        registerDate: SortDirections.DESC,
      },
    });
  }

  async approveRegisterRequest(
    approveRegisterRequestDto: ApproveRegisterRequestDTO,
  ): Promise<void> {
    try {
      const userIds = approveRegisterRequestDto.userIds;
      this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ status: UserStatus.ACTIVE })
        .where('userId IN (:...userId)', { userIds })
        .execute();
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }
}
