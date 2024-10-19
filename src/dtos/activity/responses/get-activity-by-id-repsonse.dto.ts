import { Activity } from 'src/entities/activity.entity';

export class GetActivityByIdResponse {
  activity: Partial<Activity>;

  constructor(activity: Partial<Activity>) {
    this.activity = activity;
  }
}
