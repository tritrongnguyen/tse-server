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

  @Column('text', {
    nullable: false,
  })
  body?: string;

  @ManyToOne(() => User, (user) => user.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  @OneToMany(
    () => QuestionCategory,
    (questionCategory) => questionCategory.question,
  )
  questionCategories?: QuestionCategory[];

  constructor(title?: string, body?: string) {
    super();
    this.title = title;
    this.body = body;
  }
}
