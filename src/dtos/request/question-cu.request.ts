import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class QuestionCURequest {
  @IsNotEmpty()
  @IsBoolean()
  isUpdate: boolean;

  @ValidateIf((o) => o.isUpdate == true)
  @IsNotEmpty()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @ValidateIf((o) => o.isUpdate == true)
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds?: number[];
}
