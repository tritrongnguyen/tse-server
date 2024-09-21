import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth.interface.service';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { Services } from 'utils/type';
import { IUserService } from 'src/users/user.interface.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(@Inject(Services.USER) private userService: IUserService) {}

  register(registerUserDTO: RegisterUserDTO) {
    return this.userService.createUser();
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
