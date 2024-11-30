import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class RegisterActivityRequest {
  constructor(userId?: string, activityId?: number) {
    this.userId = userId;
    this.activityId = activityId;
  }

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsInt()
  activityId: number;
}
