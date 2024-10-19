import { User } from 'src/entities/user.entity';

export class GetLeftRequestsResponse {
  data?: User[];

  constructor(data?: User[]) {
    this.data = data;
  }
}
