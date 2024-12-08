import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CommentCURequest {
  @ValidateIf((o) => !o.isUpdate)
  @IsNotEmpty()
  @IsNumber()
  questionId?: number;

  @IsNotEmpty()
  @IsString()
  body?: string;

  @ValidateIf((o) => !o.isUpdate)
  @IsNotEmpty()
  @IsString()
  userId?: string;

  @ValidateIf((o) => o.isUpdate)
  @IsNotEmpty()
  @IsBoolean()
  isAnswer?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  isUpdate?: boolean;
}
