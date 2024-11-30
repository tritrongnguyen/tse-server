import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Public, RequiredRoles } from 'src/auth/customs';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import {
  ApiResponse,
  PaginatedQuery,
  PaginatedResponse,
} from 'src/dtos/common.dto';
import { ApproveLeftRequest } from 'src/dtos/users/requests/approve-left-request.dto';
import { GetUserInfoByIdRequest } from 'src/dtos/users/requests/get-user-info-by-id-request.dto';
import { GetLeftRequestsResponse } from 'src/dtos/users/response/get-left-requests-response.dto';
import GetRegisterUsersResponse from 'src/dtos/users/response/get-register-users-response.dto';
import { GetUserInfoByIdResponse } from 'src/dtos/users/response/get-user-info-by-id-response.dto';
import { User } from 'src/entities/user.entity';
import { Routes, Services, SortDirections } from 'utils/constants';
import { HttpExceptionFilter } from 'utils/http-exception-filter';
import { Roles } from 'utils/security-constants';
import { EntityPropertyErrorFilter } from './filters/entity-property-error-filter.filter';
import { IUserService } from './user.interface.service';
import { ActivateUserRequest } from '../dtos/users/requests/approve-register-request.dto';

@Controller(Routes.USERS)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(@Inject(Services.USER) private userService: IUserService) {}

  @Public()
  @Get('')
  // @RequiredRoles(Roles.ADMIN, Roles.CORE)
  @UseFilters(EntityPropertyErrorFilter)
  async getUsersPaginated(
    @Query() query?: PaginatedQuery<User>,
  ): Promise<ApiResponse<PaginatedResponse<Partial<User>>>> {
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

    const paginatedResponse = await this.userService.getAllUsersPaginated(
      page,
      size,
      normalizeSortDirection,
      sortBy,
    );

    return new ApiResponse<PaginatedResponse<Partial<User>>>(
      HttpStatus.OK,
      'Success',
      paginatedResponse,
    );
  }

  @Public()
  @Get(':userId/info')
  async getUserInfoById(
    @Param() paramDTO: GetUserInfoByIdRequest,
  ): Promise<ApiResponse<GetUserInfoByIdResponse>> {
    const userFound: User = await this.userService.getUserInfoById(
      paramDTO.userId,
    );

    return new ApiResponse<GetUserInfoByIdResponse>(
      HttpStatus.OK,
      'Success',
      new GetUserInfoByIdResponse(instanceToPlain(userFound)),
    );
  }

  @Public()
  @Get('registers')
  @HttpCode(HttpStatus.OK)
  // @RequiredRoles(Roles.ADMIN)
  async getRegisterUsers(
    @Query() query?: PaginatedQuery<User>,
  ): Promise<ApiResponse<PaginatedResponse<Partial<User>>>> {
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

    const paginatedResponse = await this.userService.getRegisterUsers(
      page,
      size,
      normalizeSortDirection,
      sortBy,
    );

    return new ApiResponse<PaginatedResponse<Partial<User>>>(
      HttpStatus.OK,
      'Success',
      paginatedResponse,
    );
  }

  // @Public()
  // @Get('left-request')
  // @HttpCode(HttpStatus.OK)
  // // @RequiredRoles(Roles.ADMIN)
  // async getLeftRequests(): Promise<ApiResponse<GetLeftRequestsResponse>> {
  //   const response = await this.userService.getRegisterUsers();

  //   return new ApiResponse<GetLeftRequestsResponse>(
  //     HttpStatus.OK,
  //     'Success',
  //     new GetLeftRequestsResponse(response),
  //   );
  // }

  @Public()
  @Post('activate')
  @HttpCode(HttpStatus.OK)
  async activateUser(
    @Body() activateUserRequest: ActivateUserRequest,
  ): Promise<ApiResponse<boolean>> {
    const result = await this.userService.activateUser(activateUserRequest);
    if (result) {
      return new ApiResponse(HttpStatus.OK, 'Kích hoạt thành công');
    } else {
      throw new InternalServerErrorException('Kích hoạt thất bại');
    }
  }

  @Public()
  @Post('left-request/approve')
  @HttpCode(HttpStatus.OK)
  async approveLeftRequest(@Body() approveLeftRequestDto: ApproveLeftRequest) {
    await this.userService.approveLeftRequest(approveLeftRequestDto);
  }
}
