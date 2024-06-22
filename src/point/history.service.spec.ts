import { Test, TestingModule } from '@nestjs/testing';
import { HistoryService, HistoryServiceImpl } from './history.service';
import { HistoryMockRepository } from './repositories/history.mock.repository';
import { HISTORY_REPOSITORY } from './repositories/history.repository';
import { PointHistory, TransactionType } from './point.model';

const histories: PointHistory[] = [
  {
    id: 1,
    userId: 1,
    amount: 100,
    type: TransactionType.CHARGE,
    timeMillis: Date.now(),
  },
  {
    id: 1,
    userId: 2,
    amount: 100,
    type: TransactionType.CHARGE,
    timeMillis: Date.now(),
  },
  {
    id: 1,
    userId: 1,
    amount: 100,
    type: TransactionType.USE,
    timeMillis: Date.now(),
  },
];

describe('HistoryService', () => {
  let historyService: HistoryService;
  let historyRepository: HistoryMockRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: HistoryService,
          useClass: HistoryServiceImpl,
        },
        {
          provide: HISTORY_REPOSITORY,
          useClass: HistoryMockRepository,
        },
      ],
    }).compile();

    historyService = moduleRef.get(HistoryService);
    historyRepository = moduleRef.get(HISTORY_REPOSITORY);

    jest
      .spyOn(historyRepository, 'findAllByUserId')
      .mockResolvedValue(histories);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('충전&사용 내역 조회', () => {
    /**
     * 특정 유저의 충전 & 사용 내역을 조회할 수 있는지 확인합니다.
     */
    it('특정 유저의 충전&사용 내역을 조회할 수 있어야합니다.', async () => {
      await expect(historyService.findAllByUserId(1)).resolves.toEqual(
        histories,
      );
    });
  });
});
