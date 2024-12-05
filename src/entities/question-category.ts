import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Question } from './question.entity';
import { QnACategory } from './qna-category.entity';

@Entity({
  name: 'question_categories',
})
export class QuestionCategory {
  @PrimaryColumn('bigint', {
    name: 'question_id',
  })
  @ManyToOne(() => Question, (question) => question.questionCategories)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @PrimaryColumn('bigint', {
    name: 'category_id',
  })
  @ManyToOne(() => QnACategory, (category) => category.questionCategories)
  @JoinColumn({ name: 'category_id' })
  public category: QnACategory;
}
