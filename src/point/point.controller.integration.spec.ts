import { Test, TestingModule } from '@nestjs/testing';
import { PointController } from './point.controller';
import { DatabaseModule } from '../database/database.module';
import { UserPoint } from './point.model';

describe('PointController (integration)', () => {
  let pointController: PointController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [PointController],
    }).compile();

    pointController = moduleRef.get(PointController);
  });

  it('should be defined', () => {
    expect(pointController).toBeDefined();
  });

  describe('동시에 여러 건의 충전 & 이용 요청이 들어올 경우', () => {
    /**
     * 동시에 여러 건의 충전과 이용이 발생할 때, 데이터가 꼬이지 않고 순차적으로 처리되는지 확인합니다.
     *
     * 1. +100원을 충전합니다.
     * 2. +200원을 충전합니다.
     * 3. +300원을 충전합니다.
     * 4. -100원을 사용합니다.
     * 5. -100원을 사용합니다.
     * 6. -200원을 사용합니다.
     *
     * 결과적으로 200원이 남아야 합니다.
     */
    it('충전과 이용이 순차적으로 처리되어야 합니다.', async () => {
      /**
       * Promise.all의 배열에 담긴 각각의 Promise는 병렬로 실행됩니다.
       * 따라서, 충전과 이용 메서드 내부의 Promise들 또한 이벤트 루프에 의하여 병렬로 실행되기 때문에 데이터가 꼬일 수 있습니다.
       *
       */
      await Promise.all([
        pointController.charge(1, { amount: 100 }),
        pointController.charge(1, { amount: 200 }),
        pointController.charge(1, { amount: 300 }),
        pointController.use(1, { amount: 100 }),
        pointController.use(1, { amount: 100 }),
        pointController.use(1, { amount: 200 }),
      ]);

      const expected: UserPoint = {
        id: 1,
        point: 200,
        updateMillis: expect.any(Number),
      };

      await expect(pointController.point(1)).resolves.toEqual(expected);
    });
  });
});
