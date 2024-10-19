import { MemberGroup } from 'src/entities/member-group.entity';
import { User } from 'src/entities/user.entity';

export type GroupMemberData = Partial<Omit<MemberGroup, 'member'>> & {
  member: Partial<User>;
};

export class GetAllGroupMembersResponse {
  members?: GroupMemberData[];
  constructor(data?: GroupMemberData[]) {
    this.members = data;
  }
}
