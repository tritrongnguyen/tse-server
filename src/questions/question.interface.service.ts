import { PaginatedQuery, PaginatedResponse } from '../dtos/common.dto';
import { QuestionDTO } from '../dtos/question.dto';
import { QuestionCURequest } from '../dtos/request/question-cu.request';
import { SearchQuestionRequest } from '../dtos/request/search-question.request';
import { Question } from '../entities/question.entity';

export interface IQuestionService {
  searchQuestionPaginated(
    query: PaginatedQuery<Question>,
    searchRequest: SearchQuestionRequest,
  ): Promise<PaginatedResponse<QuestionDTO>>;

  createQuestion(createRequest: QuestionCURequest): Promise<QuestionDTO>;
}
