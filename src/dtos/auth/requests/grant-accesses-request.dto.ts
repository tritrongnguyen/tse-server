import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class GrantAccessesRequest {
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsString({ each: true })
  userIds: string[];

  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  roleIds: number[];
}
