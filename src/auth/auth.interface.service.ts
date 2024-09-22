import { User } from 'src/users/entities/user.entity';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { LoginDTO } from './dtos/login-dto';

export interface IAuthService {
  validateUser(): void;
  register(registerUserDTO: RegisterUserDTO): Promise<User>;
  login(loginDto: LoginDTO): Promise<{ access_token: string }>;
  logout(): void;
  getStatus(): void;
  resetPassword(): void;
}
