import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Question } from './question.entity';
import { User } from './user.entity';

@Entity({
  name: 'answers',
})
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('text', {
    nullable: false,
  })
  body: string;

  @ManyToOne(() => Question, (question) => question.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => User, (user) => user.userId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  constructor(body: string) {
    super();
    this.body = body;
  }
}
