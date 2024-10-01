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
import { Public, RequiredRoles } from './customs';
import { AuthenticationGuard } from './guards/authentication.guard';
import LoginRequestDTO from '../dtos/auth/requests/login-request.dto';
import RegisterRequestDTO from '../dtos/auth/requests/register-request.dto';
import GrantAccessesRequestDTO from 'src/dtos/auth/requests/grant-accesses-request.dto';
import { AuthorizationGuard } from './guards/authorization.guard';
import { Roles } from 'utils/security-constants';

@Controller(Routes.AUTH)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  @Public()
  @Post('register')
  async registerUser(@Body() registerRequestDTO: RegisterRequestDTO) {
    try {
      return await this.authService.register(registerRequestDTO);
    } catch (error: any) {
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
  async login(@Body() loginRequestDto: LoginRequestDTO) {
    try {
      return await this.authService.login(loginRequestDto);
    } catch (error: any) {
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

  @Post('grant-accesses')
  @HttpCode(HttpStatus.OK)
  @RequiredRoles(Roles.ADMIN)
  async grantAccessesToUsers(
    @Body() grantAccessesRequestDto: GrantAccessesRequestDTO,
  ) {
    try {
      return await this.authService.grantAccesses(grantAccessesRequestDto);
    } catch (error) {
      throw error;
    }
  }
}
