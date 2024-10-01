import { Injectable } from '@nestjs/common';
import { IUserService } from './user.interface.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './dtos/create-user.dto';
import GetAllUsersResponseDTO from 'src/dtos/users/response/get-all-users-response.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Todo: get in here
  async getAllUsers(): Promise<GetAllUsersResponseDTO> {
    const getAllUserResponseDto = new GetAllUsersResponseDTO();
    getAllUserResponseDto.users = await this.userRepository
      .find()
      .then((users) => {
        return users.map((user) => {
          const { hashedPassword, ...rest } = user;
          return rest;
        });
      });
    return getAllUserResponseDto;
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    const newUser = new User();
    newUser.userId = createUserDTO.userId;
    newUser.hashedPassword = createUserDTO.hashedPassword;
    newUser.firstName = createUserDTO.firstName;
    newUser.lastName = createUserDTO.lastName;
    newUser.email = createUserDTO.email;
    return await this.userRepository.save(newUser);
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
