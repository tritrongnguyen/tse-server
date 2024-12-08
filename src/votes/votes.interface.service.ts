import { UpdateVoteRequest } from '../dtos/request/update-vote.request';
import { VoteDTO } from '../dtos/vote.dto';

export interface IVoteService {
  updateVote(updateVoteRequest: UpdateVoteRequest): Promise<VoteDTO>;
}
