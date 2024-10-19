import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { SortDirections } from 'utils/constants';

export class ApiResponse<T> {
  statusCode: number;
  message: string;
  data?: T;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export class PaginatedQuery<T> {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  size?: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Type(() => String)
  sortBy?: keyof T;

  @IsOptional()
  @IsEnum(SortDirections)
  @Type(() => String)
  sortDirection: SortDirections;

  constructor(
    page?: number,
    size?: number,
    sortBy?: keyof T,
    sortDirection?: SortDirections,
  ) {
    this.page = page;
    this.size = size;
    this.sortBy = sortBy;
    this.sortDirection = sortDirection;
  }
}

export class PaginatedResponse<T> {
  totalPages: number;
  totalItems: number;
  items: T[];

  constructor(totalPages: number, totalItems: number, items: T[]) {
    this.totalPages = totalPages;
    this.totalItems = totalItems;
    this.items = items;
  }
}
