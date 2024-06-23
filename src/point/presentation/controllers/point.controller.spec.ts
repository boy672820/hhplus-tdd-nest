import { Test, TestingModule } from '@nestjs/testing';
import { PointController } from './point.controller';
import { PointHistory, TransactionType, UserPoint } from '../../domain/models';
import { HistoryService, PointService } from '../../application/services';
import { mocks as serviceMocks } from '../../application/mocks';

describe('PointController', () => {
  let pointController: PointController;
  let pointService: PointService;
  let historyService: HistoryService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PointController],
      providers: [...serviceMocks],
    }).compile();

    pointController = moduleRef.get(PointController);
    pointService = moduleRef.get(PointService);
    historyService = moduleRef.get(HistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('포인트 조회', () => {
    /**
     * 특정 유저의 포인트를 조회할 수 있는지 확인합니다.
     */
    it('특정 유저의 포인트를 조회할 수 있어야합니다.', async () => {
      const userId = 1;
      const point: UserPoint = {
        id: userId,
        point: 100,
        updateMillis: Date.now(),
      };

      jest.spyOn(pointService, 'findById').mockResolvedValueOnce(point);

      await expect(pointController.point(userId)).resolves.toEqual(point);
    });
  });

  describe('포인트 내역 조회', () => {
    /**
     * 특정 유저의 포인트 내역을 조회할 수 있는지 확인합니다.
     */
    it('특정 유저의 포인트 내역을 조회할 수 있어야합니다.', async () => {
      const userId = 1;
      const histories: PointHistory[] = [
        {
          id: 1,
          userId: userId,
          amount: 100,
          type: TransactionType.CHARGE,
          timeMillis: Date.now(),
        },
      ];

      jest
        .spyOn(historyService, 'findAllByUserId')
        .mockResolvedValueOnce(histories);

      await expect(pointController.history(userId)).resolves.toEqual(histories);
    });
  });

  describe('포인트 충전', () => {
    /**
     * 특정 유저의 포인트를 충전할 수 있는지 확인합니다.
     */
    it('특정 유저의 포인트를 충전할 수 있어야합니다.', async () => {
      const userId = 1;
      const amount = 100;
      const point: UserPoint = {
        id: userId,
        point: 100,
        updateMillis: Date.now(),
      };

      jest.spyOn(pointService, 'charge').mockResolvedValueOnce(point);

      await expect(pointController.charge(userId, { amount })).resolves.toEqual(
        point,
      );
    });
  });

  describe('포인트 사용', () => {
    /**
     * 특정 유저의 포인트를 사용할 수 있는지 확인합니다.
     */
    it('특정 유저의 포인트를 사용할 수 있어야합니다.', async () => {
      const userId = 1;
      const amount = 100;
      const point: UserPoint = {
        id: userId,
        point: 100,
        updateMillis: Date.now(),
      };

      jest.spyOn(pointService, 'use').mockResolvedValueOnce(point);

      await expect(pointController.use(userId, { amount })).resolves.toEqual(
        point,
      );
    });
  });
});
