import { ApiResponseDTO } from 'src/dtos';

export class RemoveGroupMemberResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}
