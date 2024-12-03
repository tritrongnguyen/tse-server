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
import { MailerService } from '@nestjs-modules/mailer';

@Controller(Routes.USERS)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(@Inject(Services.USER) private userService: IUserService,
  private readonly mailerService: MailerService,
  
) {}

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
    const { userIds } = activateUserRequest;
    const result = await this.userService.activateUser(activateUserRequest);
   
    if (result) {
     // gửi mail thông báo kích hoạt thành công
      const users = await this.userService.getUserById(userIds[0]);
      this.mailerService
      .sendMail({
        to: users.email, // list of receivers
        subject: 'Thông báo từ TSE CLUB', // Subject line
        text: 'welcome', // plaintext body
        html: `<p>Chào ${users.lastName || 'bạn'},</p>
                <p>Chúc mừng bạn đã trở thành thành viên chính thức của CLB TSE. Chúng tôi rất vui mừng khi chào đón bạn vào đội ngũ của chúng tôi.</p>
                <p>Chúng tôi rất mong bạn sẽ có những trải nghiệm tuyệt vời và ý nghĩa khi tham gia
                vào các hoạt động của CLB.</p>
                <p>Trân trọng,</p>
                <p><b>Đội ngũ hỗ trợ CLB</b></p>
        `, // Nội dung email
      })
      return new ApiResponse(HttpStatus.OK, 'Kích hoạt thành công');
    } else {
      throw new InternalServerErrorException('Kích hoạt thất bại');
    }
  }
  // denied register request
  @Public()
  @Post('deny-register')
  @HttpCode(HttpStatus.OK)
  async denyRegisterRequest(@Body() body: { userIds: string[] }): Promise<ApiResponse<boolean>> {
    const { userIds } = body;
  
    // Kiểm tra đầu vào: userIds phải là mảng và không được rỗng
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new InternalServerErrorException('Dữ liệu userIds không hợp lệ hoặc rỗng');
    }
    // tìm user trong db để láy gmail để gửi mail
    const users = await this.userService.getUserById(userIds[0]);
    // Gọi service để thực hiện logic từ chối
    const result = await this.userService.rejectUserRegistration(userIds);
    console.log(users.email);
  
    if (result) {
      this.mailerService
      .sendMail({
        // to: 'viet1282002@gmail.com', // list of receivers
        to: users.email, // list of receivers
        subject: 'Thông báo từ TSE CLUB', // Subject line
        text: 'welcome', // plaintext body
        html: `<p>Chào ${users.lastName || 'bạn'},</p>
                <p>Rất tiếc, yêu cầu đăng ký của bạn đã bị từ chối, chúng tôi cảm thấy bạn chưa phù hợp với TSE. Chúng tôi hiểu rằng điều này có thể là một sự thất vọng và chúng tôi rất tiếc về sự bất tiện này.</p>
                <p>Chúng tôi đánh giá cao sự quan tâm của bạn và mong rằng bạn sẽ tiếp tục theo dõi các cơ hội khác trong tương lai.</p>
                <p>Trân trọng,</p>
                <p><b>Đội ngũ hỗ trợ CLB</b></p>
        `, // Nội dung email
      })
      return new ApiResponse(HttpStatus.OK, 'Từ chối đăng ký thành công', true);
    } else {
      throw new InternalServerErrorException('Từ chối đăng ký thất bại');
    }
  }
  @Public()
  @Post('left-request/approve')
  @HttpCode(HttpStatus.OK)
  async approveLeftRequest(@Body() approveLeftRequestDto: ApproveLeftRequest) {
    await this.userService.approveLeftRequest(approveLeftRequestDto);
    // gửi mail thông báo chấp nhận yêu cầu rời khỏi clb
    const users = await this.userService.getUserById(approveLeftRequestDto.userIds[0]);
    this.mailerService
    .sendMail({
      to: users.email, // list of receivers
      subject: 'Thông báo từ TSE CLUB', // Subject line
      text: 'welcome', // plaintext body
      html: `<p>Chào ${users.lastName || 'bạn'},</p>
              <p
              >Chúng tôi rất tiếc phải thông báo rằng yêu cầu rời khỏi CLB của bạn đã được chấp nhận. Chúng tôi rất ti
              ếc về sự mất mát này và
              chúng tôi rất mong rằng bạn sẽ có những trải nghiệm tốt hơn khi tham gia vào các hoạt động khác.</p>
              <p>Chúng tôi đánh giá cao sự quan tâm của bạn và mong rằng bạn sẽ tiếp tục theo dõi các cơ hội khác trong tương lai.</p>
              <p>Trân trọng,</p>
              <p><b>Đội ngũ hỗ trợ CLB</b></p>
      `, // Nội dung email
    })


              }

  @Public()
  @Post('left-request/reject')
  @HttpCode(HttpStatus.OK)
  async rejectLeftRequestingUsers(@Body() body: { userIds: string[] }) {
   await this.userService.rejectLeftRequestingUsers(body.userIds);
   // gửi mail thông báo từ chối yêu cầu rời khỏi clb
    const users = await this.userService.getUserById(body.userIds[0]);
    this.mailerService
    .sendMail({
      to: users.email, // list of receivers
      subject: 'Thông báo từ TSE CLB', // Subject line
      text: 'welcome', // plaintext body
      html: `<p>Chào ${users.lastName || 'bạn'},</p>
              <p>Rất tiếc, yêu cầu rời khỏi CLB của bạn đã bị từ chối, chúng tôi cảm thấy bạn vẫn cần phải ở lại CLB TSE. Chúng tôi hiểu rằng điều này có thể là một sự thất vọng và chúng tôi rất ti
              ếc về sự bất tiện này.</p>
              <p>Chúng tôi đánh giá cao sự quan tâm của bạn và mong rằng bạn sẽ tiếp tục ở lại CLB TSE.</p>
              <p>Trân trọng,</p>
              <p><b>Đội ngũ hỗ trợ CLB</b></p>
      `, // Nội dung email
    })
  }
// yêu cầu rời khỏi clb
  @Public()
  @Post(':userId/request-left')
  @HttpCode(HttpStatus.OK)
  async requestLeft(@Param('userId') userId: string) {
    await this.userService.requestLeft(userId);
  }

  @Public()
  @Get('getleft-requesting')
  @HttpCode(HttpStatus.OK)
  async getLeftRequestingUsers(): Promise<ApiResponse<User[]>> {
    const users = await this.userService.getLeftRequestingUsers();
    return new ApiResponse(HttpStatus.OK, 'Success', users);
  }

  // @Public()
  // @Get('getMail')
  // @HttpCode(HttpStatus.OK)
  // async getMail() {
  //   this.mailerService
  //   .sendMail({
  //     to: 'viet1282002@gmail.com', // list of receivers
  //     subject: 'Testing Nest MailerModule ✔', // Subject line
  //     text: 'welcome', // plaintext body
  //     html: '<b>welcome</b>', // HTML body content
  //   })
  // }




}
