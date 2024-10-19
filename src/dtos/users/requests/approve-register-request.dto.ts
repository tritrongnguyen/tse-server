import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ApproveRegisterRequest {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}
