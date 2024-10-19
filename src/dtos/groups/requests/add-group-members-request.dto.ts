import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class AddGroupMembersRequest {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}
