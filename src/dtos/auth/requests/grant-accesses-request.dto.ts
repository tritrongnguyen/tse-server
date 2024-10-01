import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export default class GrantAccessesRequestDTO {
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
