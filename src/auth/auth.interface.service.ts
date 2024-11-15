import { RegisterRequest } from 'src/dtos/auth/requests/register-request.dto';
import { LoginRequest } from 'src/dtos/auth/requests/login-request.dto';
import { RegisterResponse } from 'src/dtos/auth/responses/register-response.dto';
import { LoginResponse } from 'src/dtos/auth/responses/login-response.dto';
import { GrantAccessesRequest } from 'src/dtos/auth/requests/grant-accesses-request.dto';
import { GrantAccessesResponse } from 'src/dtos/auth/responses/grant-accesses-response.dto';
import { Role } from '../entities/role.entity';

export interface IAuthService {
  validateUser(): void;
  register(registerRequest: RegisterRequest): Promise<RegisterResponse>;
  login(loginRequest: LoginRequest): Promise<LoginResponse>;
  logout(): void;
  getStatus(): void;
  resetPassword(): void;
  getAllRoles(): Promise<Role[]>;
  grantAccesses(
    grantAccessRequest: GrantAccessesRequest,
  ): Promise<GrantAccessesResponse>;
}
