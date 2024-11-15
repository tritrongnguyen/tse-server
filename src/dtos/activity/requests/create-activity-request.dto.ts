import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinDate,
  MinLength,
  Validate,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  ActivityType,
  ActivityStatus,
  ActivityScope,
  VenueTypes,
} from '../../../entities/enums/activity.enum';

@ValidatorConstraint({ name: 'isTimeAfter', async: false })
export class IsTimeAfterConstraint implements ValidatorConstraintInterface {
  validate(endTime: string, args: ValidationArguments) {
    const { startTime } = args.object as { startTime: string };
    if (!startTime || !endTime) return false;

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    if (startHours > endHours) return false;
    if (startHours === endHours && startMinutes >= endMinutes) return false;

    return true;
  }

  defaultMessage() {
    return 'End time must be after start time';
  }
}

export class CreateActivityRequest {
  constructor(
    name?: string,
    description?: string,
    hostName?: string,
    capacity?: number,
    registeredNumber?: number,
    timeOpenRegister?: Date,
    timeCloseRegister?: Date,
    occurDate?: Date,
    startTime?: string,
    endTime?: string,
    venue?: string,
    venueType?: VenueTypes,
    activityType?: ActivityType,
    activityStatus?: ActivityStatus,
    activityScope?: ActivityScope,
  ) {
    this.name = name;
    this.description = description;
    this.hostName = hostName;
    this.capacity = capacity;
    this.registeredNumber = registeredNumber;
    this.timeOpenRegister = timeOpenRegister;
    this.timeCloseRegister = timeCloseRegister;
    this.startTime = startTime;
    this.endTime = endTime;
    this.occurDate = occurDate;
    this.venue = venue;
    this.activityType = activityType;
    this.activityStatus = activityStatus;
    this.activityScope = activityScope;
    this.venueType = venueType;
  }

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  description?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  hostName: string;

  @IsOptional()
  @IsInt()
  registeredNumber?: number;

  @IsNotEmpty()
  @IsInt()
  @Min(3, { message: 'Minimum capacity is 3' })
  capacity: number;

  @IsOptional()
  @Type(() => Date)
  timeOpenRegister?: Date;

  @Type(() => Date)
  timeCloseRegister: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @MinDate(new Date(), { message: 'Occurrence date must be in the future' })
  occurDate: Date;

  @IsNotEmpty({ message: 'Start time is required' })
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'Start time must be in format HH:mm or HH:mm:ss',
  })
  startTime: string;

  @IsNotEmpty({ message: 'End time is required' })
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'End time must be in format HH:mm or HH:mm:ss',
  })
  @ValidateIf((o) => !!o.startTime)
  @Validate(IsTimeAfterConstraint)
  endTime: string;

  @IsNotEmpty()
  @IsString()
  venue: string;

  @IsEnum(VenueTypes, {
    message: 'venueType must be one of the follow: ONLINE, OFFLINE',
  })
  venueType?: VenueTypes;

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
