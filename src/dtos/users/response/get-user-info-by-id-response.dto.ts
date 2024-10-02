import { ApiResponseDTO } from 'src/dtos';

export class GetUserInfoByIdResponseDTO implements ApiResponseDTO {
  constructor(statusCode: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  statusCode: number;
  message: string;
  data?: any;
}
