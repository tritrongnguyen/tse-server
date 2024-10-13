import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import {
  ActivityScope,
  ActivityStatus,
  ActivityType,
} from 'src/entities/enums/activity.enum';

export class CreateActivityRequestDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(3, { message: 'Minimum limit people is 3' })
  limitPeople: number;

  @IsOptional()
  @Type(() => Date)
  timeOpenRegister?: Date;

  @Type(() => Date)
  //   @IsNotEmpty()
  timeCloseRegister: Date;

  @Type(() => Date)
  //   @IsNotEmpty()
  startTime: Date;

  @IsNotEmpty()
  @IsString()
  venue: string;

  @IsEnum(ActivityType, {
    message:
      'activityType must be one of the following: CONTEST, PROCUREMENT, SEMINAR or TRAINING',
  })
  activityType?: ActivityType;

  @IsEnum(ActivityScope, {
    message: 'activityScope must be one of the following: INTERNAL, EXTERNAL',
  })
  activityScope?: ActivityScope;

  @IsEnum(ActivityStatus, {
    message:
      'activityStatus must be one of the following: PLAN, OPEN,CLOSE or CANCEL',
  })
  activityStatus?: ActivityStatus;
}
