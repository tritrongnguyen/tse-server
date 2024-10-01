import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { Routes, Services } from 'utils/constants';
import { IUserService } from './user.interface.service';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { RequiredRoles } from 'src/auth/customs';
import { Roles } from 'utils/security-constants';
import GetAllUsersResponseDTO from 'src/dtos/users/response/get-all-users-response.dto';

@Controller(Routes.USERS)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class UserController {
  constructor(@Inject(Services.USER) private userService: IUserService) {}

  @Get('')
  @RequiredRoles(Roles.ADMIN, Roles.CORE)
  async showUsers(): Promise<GetAllUsersResponseDTO> {
    return await this.userService.getAllUsers();
  }
}
