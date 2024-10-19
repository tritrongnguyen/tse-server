import { PaginatedResponse } from 'src/dtos/common.dto';
import { AddGroupMembersRequest } from 'src/dtos/groups/requests/add-group-members-request.dto';
import { CreateGroupRequest } from 'src/dtos/groups/requests/create-group-request.dto';
import { RemoveGroupMemberRequest } from 'src/dtos/groups/requests/remove-group-member-request.dto';
import { AddGroupMembersResponse } from 'src/dtos/groups/responses/add-group-member-response.dto';
import { CreateGroupResponse } from 'src/dtos/groups/responses/create-group-response.dto';
import { GroupMemberData } from 'src/dtos/groups/responses/get-all-group-members-response.dto';
import { Group } from 'src/entities/group.entity';
import { MemberGroup } from 'src/entities/member-group.entity';
import { SortDirections } from 'utils/constants';

export interface IGroupService {
  getAllGroupPaginated(
    pageNum?: number,
    pageSize?: number,
    sortDirection?: SortDirections,
    sortBy?: keyof Group,
  ): Promise<PaginatedResponse<Group>>;

  getGroupByPartialName(partialName: string): Promise<Partial<Group>[]>;

  createGroup(createGroup: CreateGroupRequest): Promise<CreateGroupResponse>;

  addMembersToGroup(
    groupId: number,
    addGroupMemberRequest: AddGroupMembersRequest,
  ): Promise<AddGroupMembersResponse>;

  removeMembersFromGroup(
    groupId: number,
    removeGroupMemberRequest: RemoveGroupMemberRequest,
  ): Promise<boolean>;

  getAllMemberOfGroup(groupId: number): Promise<GroupMemberData[]>;

  getGroupInformation(groupId: number): Promise<Partial<Group>>;

  changeGroupLeader(groupId: number, userId: string): Promise<boolean>;
}
