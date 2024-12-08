import { CommentDTO } from '../dtos/comment.dto';
import { PaginatedQuery, PaginatedResponse } from '../dtos/common.dto';
import { QuestionDTO } from '../dtos/question.dto';
import { QuestionCURequest } from '../dtos/request/question-cu.request';
import { SearchCommentRequest } from '../dtos/request/search-comment-request';
import { SearchQuestionRequest } from '../dtos/request/search-question.request';
import { Comment } from '../entities/comment.entity';
import { Question } from '../entities/question.entity';

export interface IQuestionService {
  getPinQuestions(): Promise<QuestionDTO[]>;

  searchQuestionPaginated(
    query: PaginatedQuery<Question>,
    searchRequest: SearchQuestionRequest,
  ): Promise<PaginatedResponse<QuestionDTO>>;

  createQuestion(createRequest: QuestionCURequest): Promise<QuestionDTO>;

  getQuestionById(qId: number): Promise<QuestionDTO>;

  getListQuestionComment(
    questionId?: number,
    paginationQuery?: PaginatedQuery<Comment>,
    searchRequest?: SearchCommentRequest,
  ): Promise<PaginatedResponse<CommentDTO>>;
}
