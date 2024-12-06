import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { QnaTag } from './qna-tag.entity';
import { Question } from './question.entity';

@Entity({
  name: 'question_tags',
})
export class QuestionTag extends BaseEntity {
  @PrimaryColumn({ name: 'question_id' })
  questionId: number;

  @PrimaryColumn({ name: 'tag_id' })
  tagId: number;

  @ManyToOne(() => Question, (question) => question.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @ManyToOne(() => QnaTag, (tag) => tag.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag: QnaTag;

  constructor() {
    super();
  }
}
