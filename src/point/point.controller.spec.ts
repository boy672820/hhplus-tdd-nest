import { Test, TestingModule } from '@nestjs/testing';
import { PointController } from './point.controller';
import { PointService } from './point.service';
import { UserPoint } from './point.model';
import { HistoryService } from './history.service';

const pointServiceMock: PointService = {
  findById: jest.fn(),
  charge: jest.fn(),
  use: jest.fn(),
};
const historyServiceMock: HistoryService = {
  findAllByUserId: jest.fn(),
};

describe('PointController', () => {
  let pointController: PointController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PointController],
      providers: [
        {
          provide: PointService,
          useValue: pointServiceMock,
        },
        {
          provide: HistoryService,
          useValue: historyServiceMock,
        },
      ],
    }).compile();

    pointController = moduleRef.get(PointController);
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

      jest.spyOn(pointServiceMock, 'findById').mockResolvedValueOnce(point);

      await expect(pointController.point(userId)).resolves.toEqual(point);
    });
  });
});
