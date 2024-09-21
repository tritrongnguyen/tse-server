import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth.interface.service';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { IUserService } from 'src/users/user.interface.service';
import { Services } from 'utils/constants';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService implements IAuthService {
  constructor(@Inject(Services.USER) private userService: IUserService) {}

  async register(registerUser: RegisterUserDTO) {
    try {
      console.log(registerUser);
    } catch (error) {
      console.error(error.message);
    }
  }
  login(): void {
    throw new Error('Method not implemented.');
  }
  logout(): void {
    throw new Error('Method not implemented.');
  }
  getStatus(): void {
    throw new Error('Method not implemented.');
  }
  resetPassword(): void {
    throw new Error('Method not implemented.');
  }
  validateUser(): void {
    throw new Error('Method not implemented.');
  }
}
