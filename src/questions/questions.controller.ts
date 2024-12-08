import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseFilters,
  UseGuards,
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
import { Public } from '../auth/customs';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { CommentDTO } from '../dtos/comment.dto';
import { Comment } from '../entities/comment.entity';

@Controller(Routes.QUESTION)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class QuestionsController {
  constructor(
    @Inject(Services.QUESTION)
    private questionService: IQuestionService,
  ) {}

  @Public()
  @Post('/:id/comments')
  async getQuestionComments(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationQuery: PaginatedQuery<Comment>,
    @Body() getCommentsRequest: SearchQuestionRequest,
  ): Promise<ApiResponse<PaginatedResponse<CommentDTO>>> {
    const page = await this.questionService.getListQuestionComment(
      id,
      paginationQuery,
      getCommentsRequest,
    );
    return new ApiResponse(
      HttpStatus.OK,
      'Lấy danh sách comment thành công',
      page,
    );
  }

  @Public()
  @Get('/details/:id')
  async getQuestionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<QuestionDTO>> {
    const question = await this.questionService.getQuestionById(id);
    return new ApiResponse(HttpStatus.OK, 'Lấy câu hỏi thành công', question);
  }

  @Public()
  @Get('/pin')
  async getPinQuestions(): Promise<ApiResponse<QuestionDTO[]>> {
    const questions = await this.questionService.getPinQuestions();
    return new ApiResponse<QuestionDTO[]>(
      HttpStatus.OK,
      'Lấy danh sách câu hỏi ghim thành công',
      questions,
    );
  }

  @Public()
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
  @Public()
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
