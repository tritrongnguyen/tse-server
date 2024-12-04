import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { QnaTag } from './qna-tag.entity';
import { Question } from './question.entity';

@Entity({
  name: 'question_tags',
})
export class QuestionTag extends BaseEntity {
  @PrimaryColumn()
  questionId: number;

  @PrimaryColumn()
  tagId: number;

  @ManyToOne(() => Question, (question) => question.id, { onDelete: 'CASCADE' })
  question: Question;

  @ManyToOne(() => QnaTag, (tag) => tag.id, { onDelete: 'CASCADE' })
  tag: QnaTag;

  constructor() {
    super();
  }
}
