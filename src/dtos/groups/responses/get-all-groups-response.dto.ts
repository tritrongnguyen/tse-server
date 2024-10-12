import { Group } from 'src/entities/group.entity';
import { ApiResponseDTO } from '../..';
import { Expose, Type } from 'class-transformer';

export class GetAllGroupsResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data: {
    groups: Partial<Group>[];
    pageable: number;
  };

  constructor(
    statusCode: number,
    message: string,
    data: { groups: Partial<Group>[]; pageable: number },
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
