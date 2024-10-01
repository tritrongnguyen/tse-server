import GrantAccessesRequestDTO from 'src/dtos/auth/requests/grant-accesses-request.dto';
import LoginRequestDTO from '../dtos/auth/requests/login-request.dto';
import RegisterRequestDTO from '../dtos/auth/requests/register-request.dto';
import GrantAccessesResponseDTO from 'src/dtos/auth/responses/grant-accesses-response.dto';
import { RegisterResponseDTO } from 'src/dtos/auth/responses/register-response.dto';
import { LoginResponseDTO } from 'src/dtos/auth/responses/login-response.dto';

export interface IAuthService {
  validateUser(): void;
  register(
    registerRequestDTO: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO>;
  login(LoginRequestDTO: LoginRequestDTO): Promise<LoginResponseDTO>;
  logout(): void;
  getStatus(): void;
  resetPassword(): void;
  grantAccesses(
    grantAccessRequestDto: GrantAccessesRequestDTO,
  ): Promise<GrantAccessesResponseDTO>;
}
