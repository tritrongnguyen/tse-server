import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AddRoleDTO } from './dtos/add-role.dto';
import { Routes, Services } from 'utils/constants';
import { IAdminService } from './admin.interface.service';

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
}
