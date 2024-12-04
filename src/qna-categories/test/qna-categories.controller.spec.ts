import { Test, TestingModule } from '@nestjs/testing';
import { QnaCategoriesController } from '../qna-categories.controller';

describe('QnaCategoriesController', () => {
  let controller: QnaCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QnaCategoriesController],
    }).compile();

    controller = module.get<QnaCategoriesController>(QnaCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
