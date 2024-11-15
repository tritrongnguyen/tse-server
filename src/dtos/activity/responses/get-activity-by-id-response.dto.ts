import { DateTime } from 'luxon';
import { Activity } from 'src/entities/activity.entity';
import { toGMT7DateTime } from '../../../../utils/helpers/datetime.helper';

export type ActivityDTO = Omit<
  Activity,
  | 'timeCloseRegister'
  | 'timeOpenRegister'
  | 'startTime'
  | 'endTime'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
  timeCloseRegister: DateTime;
  timeOpenRegister: DateTime;
  startTime: string;
  endTime: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt: DateTime;
};

export class GetActivityByIdResponse {
  activity: Partial<ActivityDTO>;

  constructor(activity: Partial<Activity>) {
    this.activity = {
      ...activity,
      timeCloseRegister: toGMT7DateTime(activity.timeCloseRegister),
      timeOpenRegister: toGMT7DateTime(activity.timeOpenRegister),
      startTime: activity.startTime,
      createdAt: toGMT7DateTime(activity.createdAt),
      updatedAt: toGMT7DateTime(activity.updatedAt),
      deletedAt: toGMT7DateTime(activity.deletedAt),
    };
  }
}
