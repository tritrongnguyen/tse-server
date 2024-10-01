import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { Routes, Services } from 'utils/constants';
import { IAdminService } from './admin.interface.service';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { RequiredRoles } from 'src/auth/customs';
import { Roles } from 'utils/security-constants';
import GrantAccessesRequestDTO from '../dtos/auth/requests/grant-accesses-request.dto';
import { IUserService } from 'src/users/user.interface.service';
import { IAuthService } from 'src/auth/auth.interface.service';
import ApproveUserRegisterDTO from './dtos/request/ApproveUserRegister.dto';

@Controller(Routes.ADMIN)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@RequiredRoles(Roles.ADMIN)
export class AdminController {
  constructor(
    @Inject(Services.ADMIN)
    private adminService: IAdminService,

    @Inject(Services.USER)
    private userService: IUserService,

    @Inject(Services.AUTH)
    private authService: IAuthService,
  ) {}

  @Get('roles')
  showRoles() {
    return 'This is get all the roles';
  }

  @Post('roles/grant-accesses')
  @HttpCode(HttpStatus.OK)
  async grantAccessesToUsers(
    @Body() grantAccessesRequestDto: GrantAccessesRequestDTO,
  ) {
    try {
      return await this.authService.grantAccesses(grantAccessesRequestDto);
    } catch (error) {
      throw error;
    }
  }

  @Get('users/registers')
  @HttpCode(HttpStatus.OK)
  showUserRegisters() {
    return 'Show approve';
  }

  @Post('users/registers/approve')
  @HttpCode(HttpStatus.OK)
  approveUserRegister(@Body() approveUserRegisterDto: ApproveUserRegisterDTO) {
    return 'Approved';
  }
}
