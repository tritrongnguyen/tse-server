import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '../entities/question.entity';
import { Services } from '../../utils/constants';
import { User } from '../entities/user.entity';
import { Comment } from '../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User, Comment])],
  controllers: [QuestionsController],
  providers: [
    {
      provide: Services.QUESTION,
      useClass: QuestionsService,
    },
  ],
})
export class QuestionsModule {}
