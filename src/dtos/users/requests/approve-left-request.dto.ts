import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ApproveLeftRequest {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}
