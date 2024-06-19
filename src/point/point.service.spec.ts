import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';

describe('PointService', () => {
  let pointService: PointService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [PointService],
    }).compile();

    pointService = moduleRef.get(PointService);
  });

  it('should be defined', () => {
    expect(pointService).toBeDefined();
  });
});
