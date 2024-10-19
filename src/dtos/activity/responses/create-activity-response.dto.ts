import { Activity } from 'src/entities/activity.entity';

export class CreateActivityResponse {
  createdActivity: Partial<Activity>;

  constructor(createdActivity: Partial<Activity>) {
    this.createdActivity = createdActivity;
  }
}
