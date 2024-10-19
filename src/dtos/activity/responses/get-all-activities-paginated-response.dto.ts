import { Activity } from 'src/entities/activity.entity';

export class GetAllActivitiesPaginatedResponse {
  total: number;
  totalPages: number;
  results: Activity[];

  constructor(total: number, totalPages: number, results: Activity[]) {
    this.total = total;
    this.totalPages = totalPages;
    this.results = results;
  }
}
