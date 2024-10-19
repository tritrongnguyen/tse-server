import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateGroupRequest {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  groupName: string;

  description?: string;

  @IsNotEmpty()
  leaderId: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayNotEmpty()
  @IsString({ each: true })
  memberIds: string[];
}
