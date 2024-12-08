import { Injectable, NotFoundException } from '@nestjs/common';
import { ICommentService } from './comment.interface.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentDTO } from '../dtos/comment.dto';
import { CommentCURequest } from '../dtos/request/comment-cu-request';
import { Question } from '../entities/question.entity';
import { User } from '../entities/user.entity';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class CommentsService implements ICommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async updateComment(request: CommentCURequest): Promise<CommentDTO> {
    const { userId, body, isAnswer, isUpdate, questionId } = request;
    if (isUpdate) {
      const queryBuilder = this.commentRepository.createQueryBuilder('comment');
      const result = await queryBuilder
        .update()
        .set({ isAnswer: isAnswer })
        .set({ body: body })
        .where('comment.id = :id', { id: questionId })
        .returning('*')
        .execute();
      return plainToInstance(CommentDTO, result, {
        excludeExtraneousValues: true,
      });
    } else {
      const checkUser = await this.userRepository.findOne({
        where: { userId },
      });
      if (!checkUser) {
        throw new NotFoundException('User not found');
      }

      const checkQuestion = await this.questionRepository.findOne({
        where: { id: questionId },
      });

      if (!checkQuestion) {
        throw new NotFoundException('Question not found');
      }

      const comment = new Comment();
      comment.body = body;
      comment.user = checkUser;
      comment.question = checkQuestion;
      const result = await this.commentRepository.save(comment);
      return plainToClass(CommentDTO, result, {
        excludeExtraneousValues: true,
      });
    }
  }
}
