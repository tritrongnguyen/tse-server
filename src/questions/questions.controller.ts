import {
  Body,
  Controller,
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
import { CreateQuestionRequest } from '../dtos/request/create-question.request';

@Controller(Routes.QUESTION)
@UseFilters(HttpExceptionFilter)
export class QuestionsController {
  constructor(
    @Inject(Services.QUESTION)
    private questionService: IQuestionService,
  ) {}

  @Post('/list')
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
    @Body() createQuestionRequest: CreateQuestionRequest,
  ): Promise<ApiResponse<QuestionDTO>> {
    return;
  }
}
