import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Question } from './question.entity';
import { CommentVote } from './comment-vote.entity';

@Entity({
  name: 'comments',
})
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id?: number;

  @Column('text', {
    nullable: false,
  })
  body?: string;

  @Column('boolean', {
    nullable: false,
    default: false,
  })
  isAnswer?: boolean;

  @ManyToOne(() => User, (user) => user.userId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Question, (question) => question.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @OneToMany(() => CommentVote, (commentVote) => commentVote.comment)
  commentVotes?: CommentVote[];

  constructor(id?: number, body?: string, isAnswer?: boolean) {
    super();
    this.id = id;
    this.body = body;
    this.isAnswer = isAnswer;
  }
}
