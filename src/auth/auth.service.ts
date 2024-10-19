import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthService } from './auth.interface.service';
import { IUserService } from 'src/users/user.interface.service';
import { JwtService } from '@nestjs/jwt';
import { Services } from 'utils/constants';

import { UserStatus } from 'src/entities/enums/user.enum';
import { RoleStatus } from 'src/entities/enums/role.enum';
import passwordHelper from 'utils/helpers/password-helper';
import { RegisterRequest } from 'src/dtos/auth/requests/register-request.dto';
import { LoginRequest } from 'src/dtos/auth/requests/login-request.dto';
import { RegisterResponse } from 'src/dtos/auth/responses/register-response.dto';
import { LoginResponse } from 'src/dtos/auth/responses/login-response.dto';
import { GrantAccessesRequest } from 'src/dtos/auth/requests/grant-accesses-request.dto';
import { GrantAccessesResponse } from 'src/dtos/auth/responses/grant-accesses-response.dto';
import { CreateUserRequest } from 'src/dtos/users/requests/create-user-request.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USER)
    private userService: IUserService,

    private jwtService: JwtService,
  ) {}

  async register(registerUser: RegisterRequest): Promise<RegisterResponse> {
    const userIdExisted = await this.userService.checkUserIdExisted(
      registerUser.userId,
    );
    if (userIdExisted)
      throw new ConflictException(
        `This id "${registerUser.userId}" already existed!!!`,
      );

    const emailExisted = await this.userService.checkEmailExisted(
      registerUser.email,
    );

    if (emailExisted)
      throw new ConflictException(
        `This email "${registerUser.email}" already existed!!!`,
      );

    const hashedPassword = passwordHelper.hashPassword(registerUser.password);

    const createUserDTO = new CreateUserRequest(
      registerUser.userId,
      hashedPassword,
      registerUser.email,
      registerUser.firstName,
      registerUser.lastName,
      UserStatus.PENDING_APPROVAL,
    );

    const userCreated = await this.userService.createUser(createUserDTO);

    if (!userCreated)
      throw new InternalServerErrorException('Something went wrong!');

    return new RegisterResponse({
      userId: userCreated.userId,
      status: userCreated.status,
    });
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const isUserIdExisted = await this.userService.checkUserIdExisted(
      loginRequest.userId,
    );
    if (!isUserIdExisted)
      throw new NotFoundException(
        `This id ${loginRequest.userId} is not existed!!!`,
      );

    const userFound = await this.userService.findUserById(loginRequest.userId);

    if (userFound.status !== UserStatus.ACTIVE)
      throw new UnauthorizedException('User may not activate');

    const matchPassword = passwordHelper.comparePassword(
      loginRequest.password,
      userFound.hashedPassword,
    );

    if (!matchPassword)
      throw new UnauthorizedException('ID or password is wrong!!!');

    const userRoles = await userFound.rolesGrant.then((results) => {
      return results
        .filter(
          (roleGrant) =>
            roleGrant.isGrant && roleGrant.role.status === RoleStatus.ACTIVE,
        )
        .map((roleGrant) => roleGrant.role.roleName);
    });

    const payload = {
      sub: userFound.userId,
      username: userFound.email,
      roles: userRoles,
    };
    const token = await this.jwtService.signAsync(payload);
    return new LoginResponse(token);
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

  async grantAccesses(
    grantAccessRequest: GrantAccessesRequest,
  ): Promise<GrantAccessesResponse> {
    try {
      return new GrantAccessesResponse(null);
    } catch (error) {
      throw error;
    }
  }
}
