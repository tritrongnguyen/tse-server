import { Module } from '@nestjs/common';
import { QnaCategoriesController } from './qna-categories.controller';
import { QnaCategoriesService } from './qna-categories.service';

@Module({
  controllers: [QnaCategoriesController],
  providers: [QnaCategoriesService],
})
export class QnaCategoriesModule {}
