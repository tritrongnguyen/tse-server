import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IUserService } from './user.interface.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: User): Promise<User> {
    try {
      const createdUser = this.userRepository.create(user);
      await this.userRepository.save(createdUser);
      return;
    } catch (error) {
      if (error.code == '23505') {
        throw new ConflictException('User with this id already exits');
      } else {
        throw new InternalServerErrorException('Some thing went wrong!');
      }
    }
  }
}
