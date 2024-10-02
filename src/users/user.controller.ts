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
import { HttpExceptionFilter } from 'utils/http-exception-filter';

@Controller(Routes.USERS)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(@Inject(Services.USER) private userService: IUserService) {}

  @Get('')
  @RequiredRoles(Roles.ADMIN, Roles.CORE)
  @UseFilters(EntityPropertyErrorFilter)
  async showUsersPaginated(
    @Query('query') query?: PaginationQuery,
  ): Promise<GetAllUsersResponseDTO> {
    const {
      page = 1,
      size = 15,
      sortBy = 'userId',
      sortDirection = SortDirections.ASC,
    } = query;

    const normalizeSortDirection =
      sortDirection.toLocaleLowerCase() === 'desc'
        ? SortDirections.DESC
        : (SortDirections.ASC ?? SortDirections.ASC);

    const { users, pageable } = await this.userService.getAllUsersPaginated(
      page,
      size,
      normalizeSortDirection,
      sortBy,
    );

    return new GetAllUsersResponseDTO(HttpStatus.OK, 'Success', {
      users,
      pageable,
    });
  }

  @Get(':userId/info')
  async getUserInfoById(
    @Param() paramDTO: GetUserInfoByIdRequestDTO,
  ): Promise<GetUserInfoByIdResponseDTO> {
    return this.userService.getUserInfoById(paramDTO.userId);
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
    await this.userService.approveRegisterRequest(approveRegisterRequestDto);
  }
}
