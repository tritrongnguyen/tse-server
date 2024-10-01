import { ApiResponseDTO } from 'src/dtos';

export default class UserRegisterResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
  data: any;
}
