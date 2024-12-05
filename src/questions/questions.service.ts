import { Injectable } from '@nestjs/common';
import { IQuestionService } from './question.interface.service';
import { SearchQuestionRequest } from '../dtos/request/search-question.request';
import { QuestionDTO } from '../dtos/question.dto';
import { PaginatedQuery, PaginatedResponse } from '../dtos/common.dto';
import { Question } from '../entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class QuestionsService implements IQuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async searchQuestionPaginated(
    query: PaginatedQuery<Question>,
    searchRequest: SearchQuestionRequest,
  ): Promise<PaginatedResponse<QuestionDTO>> {
    const { page = 1, size = 10 } = query;

    const startIndex = (page - 1) * size;

    const queryBuilder = this.questionRepository.createQueryBuilder('question');
    // queryBuilder
    //   .leftJoinAndSelect('question.user', 'user')
    //   .leftJoinAndSelect('question.category', 'category');
    // .leftJoinAndSelect('question.answer', 'answer')
    // .leftJoinAndSelect('question.questionTags', 'questionTags')
    // .leftJoinAndSelect('question.comments', 'comments')
    // .leftJoinAndSelect('question.votes', 'votes');

    queryBuilder.where('question.isDeleted = :isDeleted', { isDeleted: false });
    if (searchRequest.searchText) {
      queryBuilder.andWhere('question.title LIKE :searchText', {
        searchText: `%${searchRequest.searchText}%`,
      });
    }

    const [data, count] = await queryBuilder
      .skip(startIndex)
      .take(size)
      .getManyAndCount();

    console.log({ data });

    const dtoData = plainToInstance(QuestionDTO, data, {
      excludeExtraneousValues: true,
    });

    console.log({ dtoData });

    const pageable = Math.ceil(count / size);

    if (count < startIndex)
      return new PaginatedResponse<QuestionDTO>(pageable, count, []);
    else {
      return new PaginatedResponse<QuestionDTO>(pageable, count, dtoData);
    }
  }
}