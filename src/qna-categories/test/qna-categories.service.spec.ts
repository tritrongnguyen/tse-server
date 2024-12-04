import { Test, TestingModule } from '@nestjs/testing';
import { QnaCategoriesService } from '../qna-categories.service';

describe('QnaCategoriesService', () => {
  let service: QnaCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QnaCategoriesService],
    }).compile();

    service = module.get<QnaCategoriesService>(QnaCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
