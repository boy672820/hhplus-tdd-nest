import { Test, TestingModule } from '@nestjs/testing';
import { PointService, PointServiceImpl } from './point.service';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TransactionType, UserPoint } from '../../domain/models';
import { HistoryCreateInput, Repository } from '../../domain/repositories';
import { HistoryRepositoryMock } from '../../infra/repositories/history.repository.mock';
import InjectionToken from '../../injection.token';
import { mocks as repositoryMocks } from '../../infra/mocks';

describe('PointService', () => {
  let pointService: PointService;
  let pointRepository: Repository<UserPoint>;
  let historyRepository: HistoryRepositoryMock;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PointService,
          useClass: PointServiceImpl,
        },
        ...repositoryMocks,
      ],
    }).compile();

    pointService = moduleRef.get(PointService);
    pointRepository = moduleRef.get(InjectionToken.PointRepository);
    historyRepository = moduleRef.get(InjectionToken.HistoryRepository);

    // Stub
    const userPoint: UserPoint = {
      id: 1,
      point: 100,
      updateMillis: Date.now(),
    };

    jest
      .spyOn(pointRepository, 'findById')
      .mockReturnValue(Promise.resolve(userPoint));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('포인트 충전', () => {
    describe('요구사항', () => {
      /**
       * 포인트가 정상적으로 충전되는지 확인합니다.
       */
      it('포인트를 충전할 수 있어야합니다.', async () => {
        await pointService.charge(1, 100);

        const expected: UserPoint = {
          id: 1,
          point: 200,
          updateMillis: expect.any(Number),
        };
        expect(pointRepository.save).toHaveBeenCalledWith(expected);
      });

      /**
       * 포인트를 충전에 성공했을 때 내역을 저장하는지 확인합니다.
       */
      it('포인트를 충전하면 내역을 저장해야합니다.', async () => {
        await pointService.charge(1, 100);

        const expected: HistoryCreateInput = {
          userId: 1,
          amount: 100,
          type: TransactionType.CHARGE,
          timeMillis: expect.any(Number),
        };
        expect(historyRepository.create).toHaveBeenCalledWith(expected);
      });
    });

    describe('다음의 경우 예외를 발생시켜야 합니다.', () => {
      /**
       * 충전할 포인트가 0 이하일 경우,
       * 1. 잘못된 포인트 계산으로 인한 오류를 방지하기 위해 예외를 발생시켜야 합니다.
       * 2. 데이터 무결성을 위해 예외를 발생시켜야 합니다.
       * 3. 고의적으로 음수 포인트를 충전하여 다른 사용자의 포인트를 감소시키려는 시도가 있을 수 있습니다.
       */
      it('포인트가 0 이하일 경우 예외를 발생시켜야 합니다.', async () => {
        await expect(pointService.charge(1, -1)).rejects.toThrow(
          BadRequestException,
        );
        await expect(pointService.charge(1, 0)).rejects.toThrow(
          BadRequestException,
        );
      });
    });
  });

  describe('포인트 사용', () => {
    describe('요구사항', () => {
      /**
       * 포인트가 정상적으로 차감되는지 확인합니다.
       */
      it('포인트를 사용하면 차감되어야 합니다.', async () => {
        await pointService.use(1, 100);

        const expected: UserPoint = {
          id: 1,
          point: 0,
          updateMillis: expect.any(Number),
        };
        expect(pointRepository.save).toHaveBeenCalledWith(expected);
      });

      /**
       * 포인트를 사용에 성공했을 때 내역을 저장하는지 확인합니다.
       */
      it('포인트를 사용하면 내역을 저장해야합니다.', async () => {
        await pointService.use(1, 100);

        const expected: HistoryCreateInput = {
          userId: 1,
          amount: 100,
          type: TransactionType.USE,
          timeMillis: expect.any(Number),
        };
        expect(historyRepository.create).toHaveBeenCalledWith(expected);
      });
    });

    describe('다음의 경우 예외를 발생시켜야 합니다.', () => {
      /**
       * 사용할 포인트가 부족할 경우 예외를 발생시켜야 합니다.
       */
      it('포인트가 부족할 경우 사용할 수 없습니다.', async () => {
        await expect(pointService.use(1, 200)).rejects.toThrow(
          UnprocessableEntityException,
        );
      });

      /**
       * 사용할 포인트가 0 이하일 경우,
       * 1. 잘못된 포인트 계산으로 인한 오류를 방지하기 위해 예외를 발생시켜야 합니다.
       * 2. 데이터 무결성을 위해 예외를 발생시켜야 합니다.
       */
      it('포인트가 0 이하일 경우 예외를 발생시켜야 합니다.', async () => {
        await expect(pointService.use(1, -1)).rejects.toThrow(
          BadRequestException,
        );
        await expect(pointService.use(1, 0)).rejects.toThrow(
          BadRequestException,
        );
      });
    });
  });

  describe('포인트 조회', () => {
    /**
     * 특정 유저의 포인트를 조회할 수 있는지 확인합니다.
     */
    it('특정 유저의 포인트를 조회할 수 있어야합니다.', async () => {
      const expected: UserPoint = {
        id: 1,
        point: 100,
        updateMillis: expect.any(Number),
      };
      await expect(pointService.findById(1)).resolves.toEqual(expected);
    });
  });
});
