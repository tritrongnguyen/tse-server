import { Expose, Type } from 'class-transformer';
import { Answer } from '../entities/answer.entity';
import { Comment } from '../entities/comment.entity';
import { QnACategory } from '../entities/qna-category.entity';
import { QuestionTag } from '../entities/question-tag.entity';
import { User } from '../entities/user.entity';
import { Vote } from '../entities/vote.entity';

export class QuestionDTO {
  @Expose()
  id?: number;

  @Expose()
  title?: string;

  @Expose()
  body?: string;

  @Expose()
  @Type(() => User)
  user?: Partial<User>;

  @Expose()
  @Type(() => QnACategory)
  category?: Partial<QnACategory>;

  @Expose()
  @Type(() => Answer)
  answer?: Partial<Answer>;

  @Expose()
  @Type(() => QuestionTag)
  questionTags: Partial<QuestionTag>[];

  @Expose()
  @Type(() => Comment)
  comments: Partial<Comment>[];

  @Expose()
  @Type(() => Vote)
  votes?: Partial<Vote>[];

  constructor(
    id?: number,
    title?: string,
    body?: string,
    user?: Partial<User>,
    category?: Partial<QnACategory>,
    answer?: Partial<Answer>,
    questionTags?: Partial<QuestionTag>[],
    comments?: Partial<Comment>[],
    votes?: Partial<Vote>[],
  ) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.user = user;
    this.category = category;
    this.answer = answer;
    this.questionTags = questionTags;
    this.comments = comments;
    this.votes = votes;
  }
}
