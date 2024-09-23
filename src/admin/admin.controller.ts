import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AddRoleDTO } from './dtos/add-role.dto';
import { Routes, Services } from 'utils/constants';
import { IAdminService } from './admin.interface.service';
import { GrantRolesDTO } from './dtos/grant-roles.dto';
import { Public } from 'src/auth/customs';

@Controller(Routes.ADMIN)
@UseGuards(AuthenticationGuard)
export class AdminController {
  constructor(
    @Inject(Services.ADMIN)
    private adminService: IAdminService,
  ) {}

  @Get('roles')
  public showRoles() {
    console.log('All the roles');
  }

  @Post('roles')
  public addRole(@Body() addRoleDTO: AddRoleDTO) {
    try {
      return this.adminService.addRole(addRoleDTO);
    } catch (error) {
      throw error;
    }
  }

  @Post('users/:uid/roles')
  @HttpCode(HttpStatus.OK)
  @Public()
  public assignRolesToUser(
    @Param('uid') uid: string,
    @Body() grantRoleDto: GrantRolesDTO,
  ) {
    try {
      return this.adminService.grantRolesToUser(uid, grantRoleDto);
    } catch (error) {
      throw error;
    }
  }
}
