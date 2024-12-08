import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { HttpExceptionFilter } from '../../utils/http-exception-filter';
import { AuthenticationGuard } from '../auth/guards/authentication.guard';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { IVoteService } from './votes.interface.service';
import { Public } from '../auth/customs';
import { UpdateVoteRequest } from '../dtos/request/update-vote.request';
import { ApiResponse } from '../dtos/common.dto';
import { VoteDTO } from '../dtos/vote.dto';

@Controller(Routes.VOTE)
@UseFilters(HttpExceptionFilter)
@UseGuards(AuthenticationGuard, AuthorizationGuard)
export class VotesController {
  constructor(
    @Inject(Services.VOTE) private readonly voteService: IVoteService,
  ) {}

  @Public()
  @Post()
  async updateVote(
    @Body() updateRequest: UpdateVoteRequest,
  ): Promise<ApiResponse<VoteDTO>> {
    console.log({ updateRequest });
    await this.voteService.updateVote(updateRequest);
    return new ApiResponse(HttpStatus.CREATED, 'Cập nhật vote thành công');
  }
}
