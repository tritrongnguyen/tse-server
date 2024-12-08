import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { ICommentService } from './comment.interface.service';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { HttpExceptionFilter } from '../../utils/http-exception-filter';
import { ApiResponse } from '../dtos/common.dto';
import { Comment } from '../entities/comment.entity';
import { CommentDTO } from '../dtos/comment.dto';
import { CommentCURequest } from '../dtos/request/comment-cu-request';
import { Public } from '../auth/customs';

@Controller(Routes.COMMENT)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class CommentsController {
  constructor(
    @Inject(Services.COMMENT) private readonly commentService: ICommentService,
  ) {}

  @Public()
  @Post('')
  async updateComment(
    @Body() request: CommentCURequest,
  ): Promise<ApiResponse<CommentDTO>> {
    const dto = await this.commentService.updateComment(request);
    return new ApiResponse(
      HttpStatus.CREATED,
      'Comment updated successfully',
      dto,
    );
  }
}
