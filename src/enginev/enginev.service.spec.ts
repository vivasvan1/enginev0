import { Test, TestingModule } from '@nestjs/testing';
import { EnginevService } from './enginev.service';

describe('EnginevService', () => {
  let service: EnginevService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnginevService],
    }).compile();

    service = module.get<EnginevService>(EnginevService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
