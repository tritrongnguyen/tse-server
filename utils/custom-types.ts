import { SortDirections } from './constants';

export type PaginationQuery = {
  size?: number;
  page?: number;
  sortBy?: any;
  sortDirection?: SortDirections;
};
