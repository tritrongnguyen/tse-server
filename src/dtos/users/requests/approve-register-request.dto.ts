import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ActivateUserRequest {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}
