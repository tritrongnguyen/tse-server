import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Services } from '../../utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from '../entities/vote.entity';
import { User } from '../entities/user.entity';
import { Question } from '../entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, User, Question])],
  providers: [
    {
      provide: Services.VOTE,
      useClass: VotesService,
    },
  ],
  controllers: [VotesController],
})
export class VotesModule {}
