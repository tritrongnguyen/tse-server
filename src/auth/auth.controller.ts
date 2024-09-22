import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from 'utils/constants';
import { IAuthService } from './auth.interface.service';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { instanceToPlain } from 'class-transformer';
import { LoginDTO } from './dtos/login-dto';
import { Public } from 'utils/customs';
import { AuthGuard } from './guards/auth.guard';

@Controller(Routes.AUTH)
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  @Public()
  @Post('register')
  async registerUser(@Body() registerUserDTO: RegisterUserDTO) {
    try {
      return instanceToPlain(await this.authService.register(registerUserDTO));
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      else {
        console.error(error.message);
        throw new InternalServerErrorException('Something went wrong!!!');
      }
    }
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDTO) {
    try {
      return instanceToPlain(await this.authService.login(loginDto));
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      )
        throw error;
      else {
        console.error(error.message);
        throw new InternalServerErrorException('Some thing went wrong!!!');
      }
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword() {}
}
