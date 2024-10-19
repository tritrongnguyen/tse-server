import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChangeGroupLeaderRequest {
  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
