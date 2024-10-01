import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export default class ApproveUserRegisterRequestDTO {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}
