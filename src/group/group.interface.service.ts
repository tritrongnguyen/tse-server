import { AddGroupMembersRequestDTO } from 'src/dtos/groups/requests/add-group-members-request.dto';
import { CreateGroupRequestDTO } from 'src/dtos/groups/requests/create-group-request.dto';
import { RemoveGroupMemberRequestDTO } from 'src/dtos/groups/requests/remove-group-member-request.dto';
import { Group } from 'src/entities/group.entity';
import { MemberGroup } from 'src/entities/member-group.entity';
import { PaginationQuery } from 'utils/helpers/request-helper';

export interface IGroupService {
  getAllGroupPaginated(paginatedQuery: PaginationQuery): Promise<{
    groups: Partial<Group>[];
    pageable: number;
  }>;

  getGroupByPartialName(partialName: string): Promise<Partial<Group>[]>;

  createGroup(createGroupDto: CreateGroupRequestDTO): Promise<Group>;

  addMembersToGroup(
    groupId: number,
    addGroupMemberRequest: AddGroupMembersRequestDTO,
  ): Promise<Partial<MemberGroup>[]>;

  removeMembersFromGroup(
    groupId: number,
    removeGroupMemberRequest: RemoveGroupMemberRequestDTO,
  ): Promise<boolean>;

  getAllMemberOfGroup(groupId: number): Promise<Partial<MemberGroup>[]>;

  getGroupInformation(groupId: number): Promise<Partial<Group>>;

  changeGroupLeader(groupId: number, userId: string): Promise<boolean>;
}
