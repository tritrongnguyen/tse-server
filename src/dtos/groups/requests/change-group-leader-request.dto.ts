import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChangeGroupLeaderRequestDTO {
  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
