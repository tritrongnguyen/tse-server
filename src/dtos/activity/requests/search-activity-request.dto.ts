import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';
import { ActivityType } from '../../../entities/enums/activity.enum';
import { IsClassPropertyValid } from '../../../../utils/entities-helper';
import { Activity } from '../../../entities/activity.entity';

export class SearchActivityRequest {
  constructor() {}

  @IsOptional()
  @IsString()
  searchText?: string;

  @IsOptional()
  @IsArray()
  @IsIn(Object.keys(ActivityType), { each: true })
  activityTypes?: (keyof typeof ActivityType)[];

  @IsOptional()
  @IsString()
  @IsClassPropertyValid(Activity, {
    message: 'sortBy must be a valid field of Activity',
  })
  sortBy?: string;
}
