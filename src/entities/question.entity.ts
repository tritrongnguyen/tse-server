import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { QuestionCategory } from './question-category';
import { User } from './user.entity';
import {
  QuestionStatus,
  QuestionTrend,
  QuestionType,
} from './enums/question.enum';
import { QuestionVote } from './question-vote.entity';

@Entity({
  name: 'questions',
})
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id?: number;

  @Column('nvarchar', {
    length: 255,
    nullable: false,
  })
  title?: string;

  @Column('boolean', {
    nullable: false,
    default: false,
    name: 'is_pin',
  })
  isPin?: boolean;

  @Column('text', {
    nullable: false,
  })
  body?: string;

  @Column('enum', {
    enum: QuestionType,
    default: QuestionType.NORMAL,
    name: 'question_type',
  })
  type?: QuestionType;

  @Column('enum', {
    enum: QuestionStatus,
    default: QuestionStatus.OPENED,
    name: 'question_status',
  })
  status?: QuestionStatus;

  @Column('enum', {
    enum: QuestionTrend,
    default: QuestionTrend.NORMAL,
    name: 'question_trend',
  })
  trend?: QuestionTrend;

  @ManyToOne(() => User, (user) => user.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(
    () => QuestionCategory,
    (questionCategory) => questionCategory.question,
  )
  questionCategories?: QuestionCategory[];

  @OneToMany(() => QuestionVote, (questionVote) => questionVote.question)
  questionVotes?: QuestionVote[];

  constructor(title?: string, body?: string) {
    super();
    this.title = title;
    this.body = body;
  }
}
