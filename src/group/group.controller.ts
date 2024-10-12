import { GetAllGroupMembersResponseDTO } from './../dtos/groups/responses/get-all-group-members-response.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from 'utils/constants';
import { IGroupService } from './group.interface.service';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';
import { AuthenticationGuard } from 'src/auth/guards/authentication.guard';
import { HttpExceptionFilter } from 'utils/http-exception-filter';
import { EntityPropertyErrorFilter } from 'src/users/filters/entity-property-error-filter.filter';
import { Public, RequiredRoles } from 'src/auth/customs';
import { Roles } from 'utils/security-constants';
import { PaginationQuery } from 'utils/helpers/request-helper';
import { CreateGroupRequestDTO } from 'src/dtos/groups/requests/create-group-request.dto';
import { CreateGroupResponseDTO } from 'src/dtos/groups/responses/create-group-response.dto';
import { instanceToPlain } from 'class-transformer';
import { GetAllGroupsResponseDTO } from 'src/dtos/groups/responses/get-all-groups-response.dto';
import { GetGroupsByPartialNameResponseDTO } from 'src/dtos/groups/responses/get-groups-by-partial-name-response.dto';
import { GetGroupInfoResponseDTO } from 'src/dtos/groups/responses/get-group-info-response.dto';
import { ChangeGroupLeaderRequestDTO } from 'src/dtos/groups/requests/change-group-leader-request.dto';
import { ChangeGroupLeaderResponseDTO } from 'src/dtos/groups/responses/change-group-leader-response.dto';
import { AddGroupMembersRequestDTO } from 'src/dtos/groups/requests/add-group-members-request.dto';
import { IsNumber } from 'class-validator';
import { AddGroupMembersResponseDTO } from 'src/dtos/groups/responses/add-group-member-response.dto';
import { RemoveGroupMemberRequestDTO } from 'src/dtos/groups/requests/remove-group-member-request.dto';
import { RemoveGroupMemberResponseDTO } from 'src/dtos/groups/responses/remove-group-member-response.dto';

@Controller(Routes.GROUP)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@UseFilters(HttpExceptionFilter)
export class GroupController {
  constructor(@Inject(Services.GROUP) private groupService: IGroupService) {}

  @Get('')
  //   @RequiredRoles(Roles.ADMIN)
  @Public()
  @UseFilters(EntityPropertyErrorFilter)
  async getAllGroupPaginated(
    @Query('query') query?: PaginationQuery,
  ): Promise<GetAllGroupsResponseDTO> {
    const { groups, pageable } =
      await this.groupService.getAllGroupPaginated(query);
    return new GetAllGroupsResponseDTO(
      HttpStatus.OK,
      'Get groups successfully',
      {
        groups: groups.map((group) => instanceToPlain(group)),
        pageable,
      },
    );
  }

  @Get('search')
  @UseFilters(EntityPropertyErrorFilter)
  @RequiredRoles(Roles.ADMIN)
  async getGroupsByPartialName(
    @Query('partialName') partialName: string,
  ): Promise<GetGroupsByPartialNameResponseDTO> {
    const groups = await this.groupService.getGroupByPartialName(partialName);

    return new GetGroupsByPartialNameResponseDTO(
      HttpStatus.OK,
      'Get groups successfully',
      groups,
    );
  }

  @Post('')
  @Public()
  async createGroup(
    @Body() createGroupRequest: CreateGroupRequestDTO,
  ): Promise<CreateGroupResponseDTO> {
    const group = await this.groupService.createGroup(createGroupRequest);
    return new CreateGroupResponseDTO(
      HttpStatus.CREATED,
      'Create group successfully',
      group,
    );
  }

  @Get(':groupId/members')
  @Public()
  async getAllMembers(
    @Param('groupId')
    groupId: number,
  ): Promise<GetAllGroupMembersResponseDTO> {
    const groupMembers = await this.groupService.getAllMemberOfGroup(groupId);
    return new GetAllGroupMembersResponseDTO(
      HttpStatus.OK,
      'Get members successfully',
      groupMembers,
    );
  }

  @Get(':groupId')
  @Public()
  async getGroupInfo(
    @Param('groupId') groupId: number,
  ): Promise<GetGroupInfoResponseDTO> {
    const group = await this.groupService.getGroupInformation(groupId);

    return new GetGroupInfoResponseDTO(
      HttpStatus.OK,
      'Get group information successfully',
      instanceToPlain(group),
    );
  }

  @Put('change-leader')
  @Public()
  async changeGroupLeader(
    @Body() changeGroupLeaderRequestDTO: ChangeGroupLeaderRequestDTO,
  ): Promise<ChangeGroupLeaderResponseDTO> {
    const isChanged = await this.groupService.changeGroupLeader(
      changeGroupLeaderRequestDTO.groupId,
      changeGroupLeaderRequestDTO.userId,
    );
    if (isChanged) {
      return new ChangeGroupLeaderResponseDTO(
        HttpStatus.OK,
        'Change group leader successfully',
      );
    }
  }

  @Public()
  @Post(':groupId/members')
  async addMembersToGroup(
    @Param('groupId')
    groupId: number,
    @Body() addGroupMembersRequest: AddGroupMembersRequestDTO,
  ): Promise<AddGroupMembersResponseDTO> {
    const result = await this.groupService.addMembersToGroup(
      groupId,
      addGroupMembersRequest,
    );

    return new AddGroupMembersResponseDTO(
      HttpStatus.CREATED,
      'Add members to group successfully',
      result,
    );
  }

  @Public()
  @Delete(':groupId/members')
  async removeMembersFromGroup(
    @Param('groupId') groupId: number,
    @Body() removeMembersRequest: RemoveGroupMemberRequestDTO,
  ): Promise<RemoveGroupMemberResponseDTO> {
    const result = await this.groupService.removeMembersFromGroup(
      groupId,
      removeMembersRequest,
    );

    if (result) {
      return new RemoveGroupMemberResponseDTO(
        HttpStatus.OK,
        'Remove members from group successfully',
      );
    }

    return new RemoveGroupMemberResponseDTO(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Remove members froom group failed',
    );
  }

  @Delete('disperse/:groupId')
  @Public()
  async disperseGroup(@Param('groupId') groupId: string): Promise<void> {
    // await this.groupService.disperseGroup(groupId);
  }
}
