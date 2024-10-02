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
  UseFilters,
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
import { HttpExceptionFilter } from 'utils/http-exception-filter';

@Controller(Routes.AUTH)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  @Public()
  @Post('register')
  async registerUser(@Body() registerRequestDTO: RegisterRequestDTO) {
    return await this.authService.register(registerRequestDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDTO) {
    return await this.authService.login(loginRequestDto);
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
