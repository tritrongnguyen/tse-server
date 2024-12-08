import { Expose, Type } from 'class-transformer';
import { CommentVote } from '../entities/comment-vote.entity';
import { Question } from '../entities/question.entity';
import { User } from '../entities/user.entity';

export class CommentDTO {
  @Expose()
  id?: number;

  @Expose()
  body?: string;

  @Expose()
  isAnswer?: boolean;

  @Expose()
  @Type(() => User)
  user?: Partial<User>;

  @Type(() => Question)
  question?: Partial<Question>;

  @Expose()
  @Type(() => CommentVote)
  commentVotes?: Partial<CommentVote>[];

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  @Expose()
  isDeleted?: boolean;

  constructor(id?: number, body?: string, isAnswer?: boolean) {
    this.id = id;
    this.body = body;
    this.isAnswer = isAnswer;
  }
}
