import { ApiResponseDTO } from 'src/dtos';

export default class UpdateUserResponseDTO implements ApiResponseDTO {
  statusCode: number;
  message: string;
}
