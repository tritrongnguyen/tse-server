import { ApiResponseDTO } from 'src/dtos';
import { MemberGroup } from 'src/entities/member-group.entity';

export class GetAllGroupMembersResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data?: Partial<MemberGroup>[];

  constructor(
    statusCode: number,
    message: string,
    data?: Partial<MemberGroup>[],
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
