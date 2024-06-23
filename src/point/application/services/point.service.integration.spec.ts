import { Test, TestingModule } from '@nestjs/testing';
import { PointService, PointServiceImpl } from './point.service';
import { DatabaseModule } from '../../../database/database.module';
import { repositories } from '../../infra';

describe('PointService (Integration)', () => {
  let pointService: PointService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [
        {
          provide: PointService,
          useClass: PointServiceImpl,
        },
        ...repositories,
      ],
    }).compile();

    pointService = moduleRef.get<PointService>(PointService);
  });

  describe('동시성 테스트', () => {
    /**
     * 동시성 테스트를 위한 테스트 케이스입니다.
     *
     * 1. 10,000 포인트를 충전합니다.
     * 2. 100 포인트를 충전하고 100 포인트를 사용합니다.
     * 3. 100 포인트를 충전합니다.
     *
     * 위의 작업을 동시에 수행하고, 마지막에 유저의 포인트를 조회하여
     * 10,000 + 100 - 100 + 100 = 11,000 나오는지 확인합니다.
     */
    it('동시에 여러 건의 포인트 충전/사용 요청이 들어올 경우', async () => {
      await pointService.charge(1, 10_000);

      const work1 = async () => {
        return await pointService.charge(1, 100);
      };
      const work2 = async () => {
        return await pointService.use(1, 100);
      };
      const work3 = async () => {
        return await pointService.charge(1, 100);
      };
      await Promise.all([work1(), work2(), work3()]);

      const userPoint = await pointService.findById(1);
      expect(userPoint.point).toBe(10_000 + 100 - 100 + 100);
    });
  });
});
