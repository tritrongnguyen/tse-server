import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { PaginatedQuery, PaginatedResponse } from '../dtos/common.dto';
import { QuestionDTO } from '../dtos/question.dto';
import { QuestionCURequest } from '../dtos/request/question-cu.request';
import { SearchQuestionRequest } from '../dtos/request/search-question.request';
import { Question } from '../entities/question.entity';
import { User } from '../entities/user.entity';
import { IQuestionService } from './question.interface.service';

@Injectable()
export class QuestionsService implements IQuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getPinQuestions(): Promise<QuestionDTO[]> {
    return this.questionRepository.find({
      where: {
        isPin: true,
      },
    });
  }

  async searchQuestionPaginated(
    query: PaginatedQuery<Question>,
    searchRequest: SearchQuestionRequest,
  ): Promise<PaginatedResponse<QuestionDTO>> {
    const { page = 1, size = 10 } = query;

    const startIndex = (page - 1) * size;

    const queryBuilder = this.questionRepository.createQueryBuilder('question');
    queryBuilder.leftJoinAndSelect('question.user', 'user');
    queryBuilder.where('question.isDeleted = :isDeleted', { isDeleted: false });
    queryBuilder.andWhere('question.is_pin = :isPin', { isPin: false });
    queryBuilder.orderBy('question.updatedAt', 'DESC');

    if (searchRequest.searchText) {
      queryBuilder.andWhere('question.title LIKE :searchText', {
        searchText: `%${searchRequest.searchText}%`,
      });
    }

    const [data, count] = await queryBuilder
      .skip(startIndex)
      .take(size)
      .getManyAndCount();

    const dtoData = plainToInstance(QuestionDTO, data, {
      excludeExtraneousValues: true,
    });

    const pageable = Math.ceil(count / size);

    if (count < startIndex)
      return new PaginatedResponse<QuestionDTO>(pageable, count, []);
    else {
      return new PaginatedResponse<QuestionDTO>(pageable, count, dtoData);
    }
  }

  async createQuestion(createRequest: QuestionCURequest): Promise<QuestionDTO> {
    const question = new Question();
    const userQueryBuilder = this.userRepository.createQueryBuilder('user');
    if (createRequest.isUpdate) {
      question.title = createRequest.title;
      question.body = createRequest.body;
    } else {
      // check if the user is valid
      const userExist = await userQueryBuilder
        .where('user.user_id = :userId', {
          userId: createRequest.userId,
        })
        .getOne();
      if (!userExist) {
        throw new Error('Người dùng không tồn tại');
      }
      question.title = createRequest.title;
      question.body = createRequest.body;
      question.user = instanceToPlain(userExist) as User;
      question.createdBy = [userExist.firstName, userExist.lastName].join(' ');
      question.updatedBy = [userExist.firstName, userExist.lastName].join(' ');
      return this.questionRepository.save(question);
    }
  }
}
