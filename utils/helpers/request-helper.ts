import { SortDirections } from 'utils/constants';

export type PaginationQuery = {
  size?: number;
  page?: number;
  sortBy?: any;
  sortDirection?: SortDirections;
};
