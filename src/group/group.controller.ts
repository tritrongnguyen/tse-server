import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Public, RequiredRoles } from 'src/auth/customs';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import {
  ApiResponse,
  PaginatedQuery,
  PaginatedResponse,
} from 'src/dtos/common.dto';
import { AddGroupMembersRequest } from 'src/dtos/groups/requests/add-group-members-request.dto';
import { ChangeGroupLeaderRequest } from 'src/dtos/groups/requests/change-group-leader-request.dto';
import { CreateGroupRequest } from 'src/dtos/groups/requests/create-group-request.dto';
import { RemoveGroupMemberRequest } from 'src/dtos/groups/requests/remove-group-member-request.dto';
import { AddGroupMembersResponse } from 'src/dtos/groups/responses/add-group-member-response.dto';
import { CreateGroupResponse } from 'src/dtos/groups/responses/create-group-response.dto';
import { GetAllGroupMembersResponse } from 'src/dtos/groups/responses/get-all-group-members-response.dto';
import { GetGroupInfoResponse } from 'src/dtos/groups/responses/get-group-info-response.dto';
import { GetGroupsByPartialNameResponse } from 'src/dtos/groups/responses/get-groups-by-partial-name-response.dto';
import { Group } from 'src/entities/group.entity';
import { EntityPropertyErrorFilter } from 'src/users/filters/entity-property-error-filter.filter';
import { Routes, Services, SortDirections } from 'utils/constants';
import { HttpExceptionFilter } from 'utils/http-exception-filter';
import { Roles } from 'utils/security-constants';
import { IGroupService } from './group.interface.service';

@Controller(Routes.GROUP)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class GroupController {
  constructor(@Inject(Services.GROUP) private groupService: IGroupService) {}

  @Public()
  //   @RequiredRoles(Roles.ADMIN)
  @Get('')
  @UseFilters(EntityPropertyErrorFilter)
  async getAllGroupPaginated(
    @Query() query?: PaginatedQuery<Group>,
  ): Promise<ApiResponse<PaginatedResponse<Group>>> {
    const {
      page = 1,
      size = 10,
      sortBy = 'groupId',
      sortDirection = SortDirections.ASC,
    } = query;

    const normalizeSortDirection =
      sortDirection.toLocaleLowerCase() === 'desc'
        ? SortDirections.DESC
        : (SortDirections.ASC ?? SortDirections.ASC);

    const response = await this.groupService.getAllGroupPaginated(
      page,
      size,
      normalizeSortDirection,
      sortBy,
    );

    return new ApiResponse(HttpStatus.OK, 'Get groups successfully', response);
  }

  @Get('search')
  @UseFilters(EntityPropertyErrorFilter)
  @RequiredRoles(Roles.ADMIN)
  async getGroupsByPartialName(
    @Query('partialName') partialName: string,
  ): Promise<ApiResponse<GetGroupsByPartialNameResponse>> {
    const groups = await this.groupService.getGroupByPartialName(partialName);

    return new ApiResponse(
      HttpStatus.OK,
      'Get groups by partial name successfully',
      new GetGroupsByPartialNameResponse(groups),
    );
  }

  @Post('')
  @Public()
  async createGroup(
    @Body() createGroupRequest: CreateGroupRequest,
  ): Promise<ApiResponse<CreateGroupResponse>> {
    const response = await this.groupService.createGroup(createGroupRequest);
    return new ApiResponse(
      HttpStatus.CREATED,
      'Create group successfully',
      response,
    );
  }

  @Get(':groupId/members')
  @Public()
  async getAllMembers(
    @Param('groupId')
    groupId: number,
  ): Promise<ApiResponse<GetAllGroupMembersResponse>> {
    const groupMembers = await this.groupService.getAllMemberOfGroup(groupId);
    return new ApiResponse(
      HttpStatus.OK,
      'Get all members of group successfully',
      new GetAllGroupMembersResponse(groupMembers),
    );
  }

  @Get(':groupId')
  @Public()
  async getGroupInfo(
    @Param('groupId') groupId: number,
  ): Promise<GetGroupInfoResponse> {
    const response = await this.groupService.getGroupInformation(groupId);

    return new ApiResponse(
      HttpStatus.OK,
      'Get group information successfully',
      response,
    );
  }

  @Put('change-leader')
  @Public()
  async changeGroupLeader(
    @Body() changeGroupLeaderRequestDTO: ChangeGroupLeaderRequest,
  ): Promise<ApiResponse<boolean>> {
    const isChanged = await this.groupService.changeGroupLeader(
      changeGroupLeaderRequestDTO.groupId,
      changeGroupLeaderRequestDTO.userId,
    );
    if (isChanged) {
      return new ApiResponse(
        HttpStatus.OK,
        'Change group leader successfully',
        isChanged,
      );
    }
  }

  @Public()
  @Post(':groupId/members')
  async addMembersToGroup(
    @Param('groupId')
    groupId: number,
    @Body() addGroupMembersRequest: AddGroupMembersRequest,
  ): Promise<ApiResponse<AddGroupMembersResponse>> {
    const result = await this.groupService.addMembersToGroup(
      groupId,
      addGroupMembersRequest,
    );

    return new ApiResponse(
      HttpStatus.OK,
      'Add members to group successfully',
      result,
    );
  }

  @Public()
  @Delete(':groupId/members')
  async removeMembersFromGroup(
    @Param('groupId') groupId: number,
    @Body() removeMembersRequest: RemoveGroupMemberRequest,
  ): Promise<ApiResponse<boolean>> {
    const result = await this.groupService.removeMembersFromGroup(
      groupId,
      removeMembersRequest,
    );

    if (result) {
      return new ApiResponse(
        HttpStatus.OK,
        'Remove members from group successfully',
        result,
      );
    }

    return new ApiResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Remove members from group failed',
    );
  }

  @Delete('disperse/:groupId')
  @Public()
  async disperseGroup(@Param('groupId') groupId: string): Promise<void> {
    // await this.groupService.disperseGroup(groupId);
  }
}
