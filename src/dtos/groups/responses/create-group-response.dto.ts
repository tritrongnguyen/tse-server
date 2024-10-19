import { Group } from 'src/entities/group.entity';

export class CreateGroupResponse {
  group?: Partial<Group>;
  constructor(data?: Partial<Group>) {
    this.group = data;
  }
}
