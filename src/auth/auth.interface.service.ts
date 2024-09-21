import { RegisterUserDTO } from './dtos/register-user.dto';

export interface IAuthService {
  validateUser(): void;
  register(registerUserDTO: RegisterUserDTO): void;
  login(): void;
  logout(): void;
  getStatus(): void;
  resetPassword(): void;
}
