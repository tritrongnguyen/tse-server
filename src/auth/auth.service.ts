import {
  ConflictException,
  HttpStatus,
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
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import helpers from 'utils/helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleStatus } from './entities/enums/role-status.enum';
import { AccessGrant } from './entities/access-grant';
import LoginRequestDTO from '../dtos/auth/requests/login-request.dto';
import GrantAccessesResponseDTO from 'src/dtos/auth/responses/grant-accesses-response.dto';
import GrantAccessesRequestDTO from 'src/dtos/auth/requests/grant-accesses-request.dto';
import RegisterRequestDTO from 'src/dtos/auth/requests/register-request.dto';
import { RegisterResponseDTO } from 'src/dtos/auth/responses/register-response.dto';
import { LoginResponseDTO } from 'src/dtos/auth/responses/login-response.dto';
import { User } from 'src/users/entities/user.entity';
import { UserStatus } from './entities/enums/user-status.enum';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USER)
    private userService: IUserService,

    private jwtService: JwtService,

    @InjectRepository(AccessGrant)
    private accessGrantRepository: Repository<AccessGrant>,
  ) {}

  async register(
    registerUserDto: RegisterRequestDTO,
  ): Promise<RegisterResponseDTO> {
    const userIdExisted = await this.userService.checkUserIdExisted(
      registerUserDto.userId,
    );
    if (userIdExisted)
      throw new ConflictException(
        `This id "${registerUserDto.userId}" already existed!!!`,
      );

    const emailExisted = await this.userService.checkEmailExisted(
      registerUserDto.email,
    );

    if (emailExisted)
      throw new ConflictException(
        `This email "${registerUserDto.email}" already existed!!!`,
      );

    const hashedPassword = helpers.hashPassword(registerUserDto.password);

    const createUserDTO = new CreateUserDTO();
    createUserDTO.userId = registerUserDto.userId;
    createUserDTO.hashedPassword = hashedPassword;
    createUserDTO.email = registerUserDto.email;
    createUserDTO.firstName = registerUserDto.firstName;
    createUserDTO.lastName = registerUserDto.lastName;
    createUserDTO.status = UserStatus.PENDING_APPROVAL;

    const userCreated = await this.userService.createUser(createUserDTO);

    if (!userCreated)
      throw new InternalServerErrorException('Something went wrong!');

    const result = new RegisterResponseDTO();
    result.statusCode = HttpStatus.CREATED;
    result.message = 'Register successfully!';
    result.data = {
      userId: userCreated.userId,
      status: userCreated.status,
    };

    return result;
  }

  async login(loginDto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const isUserIdExisted = await this.userService.checkUserIdExisted(
      loginDto.userId,
    );
    if (!isUserIdExisted)
      throw new NotFoundException(
        `This id ${loginDto.userId} is not existed!!!`,
      );

    const userFound = await this.userService.findUserById(loginDto.userId);

    if (userFound.status !== UserStatus.ACTIVE)
      throw new UnauthorizedException('User may not activate');

    const matchPassword = helpers.comparePassword(
      loginDto.password,
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
    const loginResponse = new LoginResponseDTO();
    loginResponse.token = await this.jwtService.signAsync(payload);
    return loginResponse;
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
    grantAccessRequestDto: GrantAccessesRequestDTO,
  ): Promise<GrantAccessesResponseDTO> {
    try {
      console.log(grantAccessRequestDto);
      return new GrantAccessesResponseDTO();
    } catch (error) {
      throw error;
    }
  }
}
