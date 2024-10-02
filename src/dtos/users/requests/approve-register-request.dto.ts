import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ApproveRegisterRequestDTO {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}
