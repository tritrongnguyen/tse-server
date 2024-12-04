import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { QnACategory } from './qna-category.entity';

@Entity({
  name: 'questions',
})
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id: number;

  @Column('nvarchar', {
    length: 255,
    nullable: false,
  })
  title: string;

  @Column('text', {
    nullable: false,
  })
  body: string;

  @ManyToOne(() => User, (user) => user.userId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => QnACategory, (category) => category.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category: QnACategory;

  constructor(title: string, body: string) {
    super();
    this.title = title;
    this.body = body;
  }
}
