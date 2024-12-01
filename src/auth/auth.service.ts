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
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { PaginatedResponse } from '../dtos/common.dto';
import { CheckUserExistRequest } from '../dtos/auth/requests/check-user-exist-request.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USER)
    private userService: IUserService,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private jwtService: JwtService,
  ) {}
  async checkUserExist(checkUserExist: CheckUserExistRequest): Promise<void> {
    const { email, userId } = checkUserExist;
    const userExist = await this.userService.checkUserIdExisted(userId);

    if (userExist) {
      throw new ConflictException(`MSSV ${userId} đã tồn tại!!!`);
    }

    const emailExist = await this.userService.checkEmailExisted(email);
    if (emailExist) {
      throw new ConflictException(`Email ${email} đã tồn tại!!!`);
    }
  }

  async register(registerUser: RegisterRequest): Promise<RegisterResponse> {
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
        `MSSV ${loginRequest.userId} không tồn tại!!!`,
      );

    const userFound = await this.userService.findUserById(loginRequest.userId);

      // Kiểm tra trạng thái
      if (![UserStatus.ACTIVE, UserStatus.LEFT_REQUESTING].includes(userFound.status)) {
        throw new UnauthorizedException('Tài khoản chưa được kích hoạt hoặc không hợp lệ!!!');
      }


    const matchPassword = passwordHelper.comparePassword(
      loginRequest.password,
      userFound.hashedPassword,
    );

    if (!matchPassword)
      throw new UnauthorizedException('MSSV hoặc mật khẩu không chính xác');

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

  async getAllRoles(
    page?: number,
    size?: number,
    sortBy?: string,
    sortDirection?: string,
  ): Promise<PaginatedResponse<Role>> {
    const startIndex = (page - 1) * size;
    const [data, count] = await this.roleRepository.findAndCount({
      skip: startIndex,
      take: size,
      order: {
        [sortBy]: sortDirection,
      },
    });
    const pageable = Math.ceil(count / size);

    if (count < startIndex)
      return new PaginatedResponse<Role>(pageable, count, []);
    else {
      return new PaginatedResponse<Role>(pageable, count, data);
    }
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
