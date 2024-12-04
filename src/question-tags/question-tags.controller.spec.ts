import { Test, TestingModule } from '@nestjs/testing';
import { QuestionTagsController } from './question-tags.controller';

describe('QuestionTagsController', () => {
  let controller: QuestionTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionTagsController],
    }).compile();

    controller = module.get<QuestionTagsController>(QuestionTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
