import { MemberGroup } from '../../../entities/member-group.entity';

export class AddGroupMembersResponse {
  addedMembers?: Partial<MemberGroup>[];
  constructor(data?: Partial<MemberGroup>[]) {
    this.addedMembers = data;
  }
}
