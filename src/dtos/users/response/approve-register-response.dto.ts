import { ApiResponseDTO } from 'src/dtos';

export class ApproveRegisterResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data?: any;

  constructor(statusCode?: number, message?: string, data?: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}
