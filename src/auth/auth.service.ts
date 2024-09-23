import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthService } from './auth.interface.service';
import { IUserService } from 'src/users/user.interface.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { Services } from 'utils/constants';
import { CreateUserDTO } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import helpers from 'utils/helpers';
import { LoginDTO } from './dtos/login-dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USER)
    private userService: IUserService,
    private jwtService: JwtService,
  ) {}

  private readonly user: User[] = [];

  async register(registerUserDto: RegisterUserDTO): Promise<User> {
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

    return this.userService.createUser(createUserDTO);
  }

  async login(
    loginDto: LoginDTO,
  ): Promise<{ access_token: string; user: User }> {
    const isUserIdExisted = await this.userService.checkUserIdExisted(
      loginDto.userId,
    );
    if (!isUserIdExisted)
      throw new NotFoundException(
        `This id ${loginDto.userId} is not existed!!!`,
      );

    const userFound = await this.userService.findUserById(loginDto.userId);
    const matchPassword = helpers.comparePassword(
      loginDto.password,
      userFound.hashedPassword,
    );

    if (!matchPassword)
      throw new UnauthorizedException('ID or password is wrong!!!');

    const payload = { sub: userFound.userId, username: userFound.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userFound,
    };
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
