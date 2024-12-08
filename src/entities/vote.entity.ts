import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { VoteType } from './enums/vote.enum';
import { User } from './user.entity';
import { Question } from './question.entity';
import { QuestionVote } from './question-vote.entity';
import { CommentVote } from './comment-vote.entity';

@Entity({
  name: 'votes',
})
@Check(
  `(questionId IS NOT NULL AND answerId IS NULL) OR (answerId IS NOT NULL AND questionId IS NULL)`,
)
export class Vote extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id?: number;

  @Column('enum', {
    enum: VoteType,
    name: 'vote_type',
  })
  voteType?: VoteType;

  @ManyToOne(() => User, (user) => user.userId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @ManyToOne(() => Question, (question) => question.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question?: Question;

  // @ManyToOne(() => Comment, (comment) => comment.id, {
  //   nullable: true,
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'comment_id' })
  // comment?: Answer;

  @OneToMany(() => QuestionVote, (questionVote) => questionVote.vote)
  questionVotes?: QuestionVote[];

  @OneToMany(() => CommentVote, (commentVote) => commentVote.vote)
  commentVotes?: CommentVote[];

  constructor(voteType?: VoteType) {
    super();
    this.voteType = voteType;
  }
}
