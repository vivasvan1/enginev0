import { Test, TestingModule } from '@nestjs/testing';
import { EnginevController } from './enginev.controller';

describe('EnginevController', () => {
  let controller: EnginevController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnginevController],
    }).compile();

    controller = module.get<EnginevController>(EnginevController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
