import { ApiResponseDTO } from 'src/dtos';

export default class ApproveUserRegisterResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data: any;
}
