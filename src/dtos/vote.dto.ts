import { Expose, Type } from 'class-transformer';
import { VoteType } from '../entities/enums/vote.enum';
import { Question } from '../entities/question.entity';
import { User } from '../entities/user.entity';

export class VoteDTO {
  @Expose()
  id?: number;

  @Expose()
  voteType?: VoteType;

  @Expose()
  @Type(() => User)
  user?: Partial<User>;

  @Expose()
  @Type(() => Question)
  question?: Partial<Question>;

  // @Expose()
  // @Type(() => Answer)
  // answer?: Partial<Answer>;
}
