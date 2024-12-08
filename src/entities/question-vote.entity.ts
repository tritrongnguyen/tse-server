import { Question } from './question.entity';
import { Vote } from './vote.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({
  name: 'question_votes',
})
export class QuestionVote extends BaseEntity {
  @PrimaryColumn('bigint', { name: 'vote_id' })
  @ManyToOne(() => Vote, (vote) => vote.questionVotes)
  @JoinColumn({ name: 'vote_id' })
  vote: Vote;

  @PrimaryColumn('bigint', { name: 'question_id' })
  @ManyToOne(() => Question, (question) => question.questionVotes)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  constructor(vote?: Vote, question?: Question) {
    super();
    this.vote = vote;
    this.question = question;
  }
}
