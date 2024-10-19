import { Group } from 'src/entities/group.entity';

export class GetGroupsByPartialNameResponse {
  data?: Partial<Group>[];

  constructor(data?: Partial<Group>[]) {
    this.data = data;
  }
}
