import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ApproveLeftRequestDTO {
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];
}
