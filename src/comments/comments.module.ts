import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Services } from '../../utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { Question } from '../entities/question.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Question, User])],
  controllers: [CommentsController],
  providers: [
    {
      provide: Services.COMMENT,
      useClass: CommentsService,
    },
  ],
})
export class CommentsModule {}
