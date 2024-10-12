import { ApiResponseDTO } from 'src/dtos';

export class ChangeGroupLeaderResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    this.statusCode = statusCode;
    this.message = message;
  }
}
