import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { IUserService } from './user.interface.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import GetAllUsersResponseDTO from 'src/dtos/users/response/get-all-users-response.dto';
import UpdateUserResponseDTO from 'src/dtos/users/response/update-user-response-dto';
import UpdateUserRequestDTO from 'src/dtos/users/requests/update-user-request-dto';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { SortDirections } from 'utils/constants';
import { GetUserInfoByIdResponseDTO } from 'src/dtos/users/response/get-user-info-by-id-response.dto';

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
  ): Promise<GetAllUsersResponseDTO> {
    const getAllUserResponseDto = new GetAllUsersResponseDTO();
    const [data, count] = await this.userRepository.findAndCount({
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: {
        [sortBy]: sortDirection,
      },
    });

    getAllUserResponseDto.users = plainToInstance(User, data);
    getAllUserResponseDto.count = count;

    return getAllUserResponseDto;
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = new User();
    newUser.userId = createUserDTO.userId;
    newUser.hashedPassword = createUserDTO.hashedPassword;
    newUser.firstName = createUserDTO.firstName;
    newUser.lastName = createUserDTO.lastName;
    newUser.email = createUserDTO.email;
    newUser.status = createUserDTO.status;
    return await this.userRepository.save(newUser);
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
}
