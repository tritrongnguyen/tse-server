import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { UpdateVoteRequest } from '../dtos/request/update-vote.request';
import { VoteDTO } from '../dtos/vote.dto';
import { VoteType } from '../entities/enums/vote.enum';
import { Question } from '../entities/question.entity';
import { User } from '../entities/user.entity';
import { Vote } from '../entities/vote.entity';
import { IVoteService } from './votes.interface.service';

@Injectable()
export class VotesService implements IVoteService {
  constructor(
    @InjectRepository(Vote) private readonly voteRepository: Repository<Vote>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async updateVote(updateVoteRequest: UpdateVoteRequest): Promise<VoteDTO> {
    const voteType = updateVoteRequest.isUpvote
      ? VoteType.UP_VOTE
      : VoteType.DOWN_VOTE;

    const voteUser = await this.userRepository.findOne({
      where: {
        userId: updateVoteRequest.userId,
      },
    });

    if (!voteUser) throw new NotFoundException('Không tìm thấy người vote!');

    const voteTarget = await this.questionRepository.findOne({
      where: { id: updateVoteRequest.questionId },
    });

    // Check if is create or update
    if (updateVoteRequest.isUpdate) {
      const queryBuilder = this.voteRepository.createQueryBuilder('vote');
      queryBuilder
        .update()
        .set({
          voteType: voteType,
          updatedBy: voteUser.firstName + ' ' + voteUser.lastName,
        })
        .where('vote.user = :userId', { userId: voteUser.userId })
        .returning('*');

      if (updateVoteRequest.isForQuestion) {
        queryBuilder.andWhere('vote.question = :questionId', {
          questionId: voteTarget.id,
        });
      } else {
        queryBuilder.andWhere('vote.answer = :answerId', {
          answerId: voteTarget.id,
        });
      }

      const updated = await queryBuilder.execute();

      return plainToInstance(VoteDTO, updated.raw[0], {
        excludeExtraneousValues: true,
      });
    } else {
      const newVote = new Vote();
      newVote.user = voteUser;
      newVote.question = voteTarget;
      newVote.voteType = voteType;
      newVote.createdBy = voteUser.firstName + ' ' + voteUser.lastName;
      newVote.updatedBy = voteUser.firstName + ' ' + voteUser.lastName;
      this.voteRepository.save(newVote);
    }
  }
}
