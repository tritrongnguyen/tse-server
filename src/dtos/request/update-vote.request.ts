import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class UpdateVoteRequest {
  @IsBoolean()
  @IsNotEmpty()
  isForQuestion?: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isUpdate?: boolean;

  @IsBoolean()
  @IsNotEmpty()
  isUpvote?: boolean;

  @ValidateIf((o) => o.isUpdate)
  @IsNotEmpty()
  @IsNumber()
  voteId?: number;

  @ValidateIf((o) => o.isForQuestion)
  @IsNotEmpty()
  @IsNumber()
  questionId?: number;

  @ValidateIf((o) => !o.isForQuestion)
  @IsNotEmpty()
  @IsNumber()
  answerId?: number;

  @IsOptional()
  @IsNumber()
  commentId?: number;

  @IsString()
  userId?: string;
}
