import { Group } from 'src/entities/group.entity';

export class GetGroupInfoResponse {
  data?: Partial<Group>;

  constructor(data?: Partial<Group>) {
    this.data = data;
  }
}
