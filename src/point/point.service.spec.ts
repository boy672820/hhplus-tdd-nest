import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';
import { POINT_REPOSITORY } from './point.repository';
import { MockRepository } from './mock.repository';

describe('PointService', () => {
  let pointService: PointService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PointService,
        {
          provide: POINT_REPOSITORY,
          useClass: MockRepository,
        },
      ],
    }).compile();

    pointService = moduleRef.get(PointService);
  });

  it('should be defined', () => {
    expect(pointService).toBeDefined();
  });
});
