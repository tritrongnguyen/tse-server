import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { HttpExceptionFilter } from '../../utils/http-exception-filter';
import { IQuestionService } from './question.interface.service';
import {
  ApiResponse,
  PaginatedQuery,
  PaginatedResponse,
} from '../dtos/common.dto';
import { SearchQuestionRequest } from '../dtos/request/search-question.request';
import { QuestionDTO } from '../dtos/question.dto';
import { Question } from '../entities/question.entity';
import { QuestionCURequest } from '../dtos/request/question-cu.request';

@Controller(Routes.QUESTION)
@UseFilters(HttpExceptionFilter)
export class QuestionsController {
  constructor(
    @Inject(Services.QUESTION)
    private questionService: IQuestionService,
  ) {}

  @Post('/list')
  @HttpCode(HttpStatus.OK)
  async getSearchQuestionsPaginated(
    @Query() query: PaginatedQuery<Question>,
    @Body() searchQuestionsRequest: SearchQuestionRequest,
  ): Promise<ApiResponse<PaginatedResponse<QuestionDTO>>> {
    const paginated = await this.questionService.searchQuestionPaginated(
      query,
      searchQuestionsRequest,
    );
    return new ApiResponse<PaginatedResponse<QuestionDTO>>(
      HttpStatus.OK,
      'Tìm kiếm thành công',
      paginated,
    );
  }

  @Post('')
  async createQuestion(
    @Body() createQuestionRequest: QuestionCURequest,
  ): Promise<ApiResponse<QuestionDTO>> {
    const dto = await this.questionService.createQuestion(
      createQuestionRequest,
    );
    return new ApiResponse<QuestionDTO>(
      HttpStatus.CREATED,
      'Tạo câu hỏi thành công',
      dto,
    );
  }
}
