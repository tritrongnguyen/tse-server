import { QnACategory } from '../entities/qna-category.entity';
import { User } from '../entities/user.entity';

export class QuestionDTO {
  id?: number;
  title?: string;
  body?: string;
  user?: Partial<User>;
  category?: Partial<QnACategory>;

  constructor(
    id?: number,
    title?: string,
    body?: string,
    user?: Partial<User>,
    category?: Partial<QnACategory>,
  ) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.user = user;
    this.category = category;
  }
}
