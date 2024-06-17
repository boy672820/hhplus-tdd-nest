import { Test, TestingModule } from '@nestjs/testing';
import { PointController } from './point.controller';
import { DatabaseModule } from '../database/database.module';
import { PointHistory, TransactionType, UserPoint } from './point.model';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

describe('PointController', () => {
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

  describe('특정 유저의 포인트 조회', () => {
    /**
     * 데이터베이스 스키마에 맞지 않는 데이터가 들어올 경우 예외를 발생시켜야 합니다.
     */
    it('아이디가 올바르지 않을 경우 예외를 발생시켜야 합니다.', async () => {
      await Promise.all([
        expect(pointController.point(-1)).rejects.toThrow(BadRequestException),
        expect(pointController.point('a')).rejects.toThrow(BadRequestException),
      ]);
    });
  });

  describe('특정 유저의 포인트 충전', () => {
    /**
     * '포인트 충전' 기능이 제대로 구현되었는지 확인합니다.
     * 또한 충전이 제대로 이루어졌는지 point 엔드포인트를 통해 확인합니다. (이를 통해 point 엔드포인트가 제대로 구현되었는지도 확인합니다.)
     */
    it('특정 유저의 포인트를 충전할 수 있어야 합니다.', async () => {
      await pointController.charge(1, { amount: 100 });
      await pointController.charge(2, { amount: 200 });

      const expected1: UserPoint = {
        id: 1,
        point: 100,
        updateMillis: expect.any(Number),
      };
      const expected2: UserPoint = {
        id: 2,
        point: 200,
        updateMillis: expect.any(Number),
      };

      await Promise.all([
        expect(pointController.point(1)).resolves.toEqual(expected1),
        expect(pointController.point(2)).resolves.toEqual(expected2),
      ]);
    });

    describe('포인트 충전에 실패한 경우', () => {
      /**
       * 데이터베이스 스키마에 맞지 않는 데이터가 들어올 경우 예외를 발생시켜야 합니다.
       */
      it('아이디가 올바르지 않을 경우 예외를 발생시켜야 합니다.', async () => {
        await Promise.all([
          expect(pointController.charge(-1, { amount: 100 })).rejects.toThrow(
            BadRequestException,
          ),
          expect(pointController.charge('a', { amount: 100 })).rejects.toThrow(
            BadRequestException,
          ),
        ]);
      });

      /**
       * 충전할 포인트가 음수일 경우,
       * 1. 잘못된 포인트 계산으로 인한 오류를 방지하기 위해 예외를 발생시켜야 합니다.
       * 2. 데이터 무결성을 위해 예외를 발생시켜야 합니다.
       * 3. 고의적으로 음수 포인트를 충전하여 다른 사용자의 포인트를 감소시키려는 시도가 있을 수 있습니다.
       */
      it('포인트가 음수일 경우 예외를 발생시켜야 합니다.', async () => {
        await expect(
          pointController.charge(1, { amount: -100 }),
        ).rejects.toThrow(BadRequestException);
      });

      /**
       * 충전할 포인트가 0 이라면 의미가 없으므로 예외를 발생시켜야 합니다.
       */
      it('포인트는 0 이상이어야 합니다.', async () => {
        await expect(pointController.charge(1, { amount: 0 })).rejects.toThrow(
          BadRequestException,
        );
      });
    });
  });

  describe('특정 유저의 포인트 사용', () => {
    /**
     * '포인트 사용' 기능이 제대로 구현되었는지 확인합니다.
     */
    it('특정 유저의 포인트를 사용할 수 있어야 합니다.', async () => {
      await pointController.charge(1, { amount: 100 });

      const usePoint: UserPoint = {
        id: 1,
        point: 90,
        updateMillis: expect.any(Number),
      };
      await expect(pointController.use(1, { amount: 90 })).resolves.toEqual(
        usePoint,
      );

      const remainPoint: UserPoint = {
        id: 1,
        point: 10,
        updateMillis: expect.any(Number),
      };
      await expect(pointController.point(1)).resolves.toEqual(remainPoint);
    });

    describe('포인트 사용에 실패한 경우', () => {
      /**
       * 데이터베이스 스키마에 맞지 않는 데이터가 들어올 경우 예외를 발생시켜야 합니다.
       */
      it('아이디가 올바르지 않을 경우 예외를 발생시켜야 합니다.', async () => {
        await Promise.all([
          expect(pointController.use(-1, { amount: 100 })).rejects.toThrow(
            BadRequestException,
          ),
          expect(pointController.use('a', { amount: 100 })).rejects.toThrow(
            BadRequestException,
          ),
        ]);
      });

      /**
       * 사용할 포인트가 부족할 경우 예외를 발생시켜야 합니다.
       */
      it('포인트가 부족할 경우 예외를 발생시켜야 합니다.', async () => {
        await expect(pointController.use(1, { amount: 100 })).rejects.toThrow(
          UnprocessableEntityException,
        );
      });

      /**
       * 사용할 포인트가 음수일 경우,
       * 1. 잘못된 포인트 계산으로 인한 오류를 방지하기 위해 예외를 발생시켜야 합니다.
       * 2. 데이터 무결성을 위해 예외를 발생시켜야 합니다.
       */
      it('포인트가 음수일 경우 예외를 발생시켜야 합니다.', async () => {
        await expect(pointController.use(1, { amount: -100 })).rejects.toThrow(
          BadRequestException,
        );
      });

      /**
       * 사용할 포인트가 0 이라면 의미가 없으므로 예외를 발생시켜야 합니다.
       */
      it('포인트는 0 이상이어야 합니다.', async () => {
        await expect(pointController.use(1, { amount: 0 })).rejects.toThrow(
          BadRequestException,
        );
      });
    });
  });

  describe('특정 유저의 포인트 내역 조회', () => {
    /**
     * 포인트를 충전하고 사용하여 전체 내역을 조회합니다.
     * 이를 통해, '충전' 또는 '사용'에 대한 내역이 제대로 저장되었는지 확인합니다.
     */
    it('특정 유저의 포인트 사용 내역을 조회할 수 있어야 합니다.', async () => {
      await pointController.charge(1, { amount: 100 });
      await pointController.use(1, { amount: 50 });
      await pointController.use(1, { amount: 30 });

      const expected: PointHistory[] = [
        {
          id: 1,
          userId: 1,
          amount: 100,
          type: TransactionType.CHARGE,
          timeMillis: expect.any(Number),
        },
        {
          id: 2,
          userId: 1,
          amount: 50,
          type: TransactionType.USE,
          timeMillis: expect.any(Number),
        },
        {
          id: 3,
          userId: 1,
          amount: 30,
          type: TransactionType.USE,
          timeMillis: expect.any(Number),
        },
      ];

      await expect(pointController.history(1)).resolves.toEqual(expected);
    });

    it('아이디가 올바르지 않을 경우 예외를 발생시켜야 합니다.', async () => {
      await Promise.all([
        expect(pointController.history(-1)).rejects.toThrow(
          BadRequestException,
        ),
        expect(pointController.history('a')).rejects.toThrow(
          BadRequestException,
        ),
      ]);
    });
  });
});
