import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services, SortDirections } from 'utils/constants';
import { IUserService } from './user.interface.service';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { RequiredRoles } from 'src/auth/customs';
import { Roles } from 'utils/security-constants';
import GetAllUsersResponseDTO from 'src/dtos/users/response/get-all-users-response.dto';
import { PaginationQuery } from 'utils/custom-types';
import { EntityPropertyErrorFilter } from './error-filters/entity-property-error-filter.filter';
import { GetUserInfoByIdRequestDTO } from 'src/dtos/users/requests/get-user-info-by-id-request.dto';
import { GetUserInfoByIdResponseDTO } from 'src/dtos/users/response/get-user-info-by-id-response.dto';
import GetRegisterUsersResponseDTO from 'src/dtos/users/response/get-register-users-response.dto';
import ApproveRegisterRequestDTO from 'src/dtos/users/requests/approve-user-register-request.dto';

@Controller(Routes.USERS)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class UserController {
  constructor(@Inject(Services.USER) private userService: IUserService) {}

  @Get('')
  @RequiredRoles(Roles.ADMIN, Roles.CORE)
  @UseFilters(EntityPropertyErrorFilter)
  async showUsersPaginated(
    @Query('query') query?: PaginationQuery,
  ): Promise<GetAllUsersResponseDTO> {
    try {
      const pageNum = query?.page ?? 1;
      const pageSize = query?.size ?? 15;
      let sortBy = query?.sortBy ?? 'userId';
      const sortDirection =
        query?.sortDirection === 'desc'
          ? SortDirections.DESC
          : (SortDirections.ASC ?? SortDirections.ASC);

      const result = await this.userService.getAllUsersPaginated(
        pageNum,
        pageSize,
        sortDirection,
        sortBy,
      );

      return new GetAllUsersResponseDTO(HttpStatus.OK, 'Success', {
        users: result.users,
        pageable: result.pageable,
      });
    } catch (error) {
      throw error;
    }
  }

  @Get(':userId/info')
  @RequiredRoles(Roles.ADMIN)
  async getUserInfoById(
    @Param() paramDTO: GetUserInfoByIdRequestDTO,
  ): Promise<GetUserInfoByIdResponseDTO> {
    try {
      return this.userService.getUserInfoById(paramDTO.userId);
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }

  @Get('registers')
  @HttpCode(HttpStatus.OK)
  @RequiredRoles(Roles.ADMIN)
  async getRegisterUsers(): Promise<GetRegisterUsersResponseDTO> {
    return new GetRegisterUsersResponseDTO(
      HttpStatus.OK,
      'Success',
      await this.userService.getRegisterUsers(),
    );
  }

  // Todo: Improve and test this function
  @Post('registers/approve')
  @HttpCode(HttpStatus.OK)
  async approveRegisterRequest(
    @Body() approveRegisterRequestDto: ApproveRegisterRequestDTO,
  ) {
    try {
      await this.userService.approveRegisterRequest(approveRegisterRequestDto);
    } catch (error: any) {
      console.error(error.message);
      throw error;
    }
  }
}
