import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { GrantAccessesRequest } from 'src/dtos/auth/requests/grant-accesses-request.dto';
import { LoginRequest } from 'src/dtos/auth/requests/login-request.dto';
import { RegisterRequest } from 'src/dtos/auth/requests/register-request.dto';
import { GrantAccessesResponse } from 'src/dtos/auth/responses/grant-accesses-response.dto';
import { LoginResponse } from 'src/dtos/auth/responses/login-response.dto';
import { RegisterResponse } from 'src/dtos/auth/responses/register-response.dto';
import { ApiResponse } from 'src/dtos/common.dto';
import { Routes, Services } from 'utils/constants';
import { HttpExceptionFilter } from 'utils/http-exception-filter';
import { Roles } from 'utils/security-constants';
import { IAuthService } from './auth.interface.service';
import { Public, RequiredRoles } from './customs';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthorizationGuard } from './guards/authorization.guard';

@Controller(Routes.AUTH)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  @Public()
  @Post('register')
  async registerUser(
    @Body() registerRequest: RegisterRequest,
  ): Promise<ApiResponse<RegisterResponse>> {
    const registerResponse = await this.authService.register(registerRequest);
    return new ApiResponse(
      HttpStatus.CREATED,
      'User registered successfully',
      registerResponse,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  async login(
    @Body() loginRequest: LoginRequest,
  ): Promise<ApiResponse<LoginResponse>> {
    const loginResponse = await this.authService.login(loginRequest);
    return new ApiResponse(
      HttpStatus.OK,
      'User logged in successfully',
      loginResponse,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword() {}

  @Public()
  // @RequiredRoles(Roles.ADMIN)
  @Post('grant-accesses')
  @HttpCode(HttpStatus.OK)
  async grantAccessesToUsers(
    @Body() grantAccessesRequest: GrantAccessesRequest,
  ): Promise<ApiResponse<GrantAccessesResponse>> {
    const grantAccessesResponse =
      await this.authService.grantAccesses(grantAccessesRequest);
    return new ApiResponse(
      HttpStatus.OK,
      'Accesses granted successfully',
      grantAccessesResponse,
    );
  }
}
