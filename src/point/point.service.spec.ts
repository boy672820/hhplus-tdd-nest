import { Test, TestingModule } from '@nestjs/testing';
import { PointService } from './point.service';
import { POINT_REPOSITORY } from './point.repository';
import { MockRepository } from './mock.repository';
import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserPoint } from './point.model';
import { Repository } from './repository.interface';

describe('PointService', () => {
  let pointService: PointService;
  let pointRepository: Repository<UserPoint>;

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
    pointRepository = moduleRef.get(POINT_REPOSITORY);
  });

  it('should be defined', () => {
    expect(pointService).toBeDefined();
  });

  describe('포인트 충전', () => {
    /**
     * 포인트가 정상적으로 충전되는지 확인합니다.
     */
    it('포인트를 충전하면 충전된 포인트를 반환해야 합니다.', async () => {
      const userPoint: UserPoint = {
        id: 1,
        point: 100,
        updateMillis: Date.now(),
      };
      jest
        .spyOn(pointRepository, 'findById')
        .mockReturnValueOnce(Promise.resolve(userPoint));

      const expected: UserPoint = {
        id: 1,
        point: 200,
        updateMillis: expect.any(Number),
      };
      await expect(pointService.charge(1, 100)).resolves.toEqual(expected);
      expect(pointRepository.save).toHaveBeenCalledWith(expected);
    });

    /**
     * 충전할 포인트가 0 이하일 경우,
     * 1. 잘못된 포인트 계산으로 인한 오류를 방지하기 위해 예외를 발생시켜야 합니다.
     * 2. 데이터 무결성을 위해 예외를 발생시켜야 합니다.
     * 3. 고의적으로 음수 포인트를 충전하여 다른 사용자의 포인트를 감소시키려는 시도가 있을 수 있습니다.
     */
    it('포인트가 음수일 경우 예외를 발생시켜야 합니다.', async () => {
      await expect(pointService.charge(1, -1)).rejects.toThrow(
        BadRequestException,
      );
      await expect(pointService.charge(1, 0)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('포인트 사용', () => {
    /**
     * 사용할 포인트가 부족할 경우 예외를 발생시켜야 합니다.
     */
    it('포인트가 부족할 경우 사용할 수 없습니다.', async () => {
      const userPoint: UserPoint = {
        id: 1,
        point: 100,
        updateMillis: Date.now(),
      };
      jest
        .spyOn(pointRepository, 'findById')
        .mockReturnValueOnce(Promise.resolve(userPoint));

      await expect(pointService.use(1, 200)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });

    /**
     * 사용할 포인트가 0 이하일 경우,
     * 1. 잘못된 포인트 계산으로 인한 오류를 방지하기 위해 예외를 발생시켜야 합니다.
     * 2. 데이터 무결성을 위해 예외를 발생시켜야 합니다.
     */
    it('포인트가 음수일 경우 예외를 발생시켜야 합니다.', async () => {
      await expect(pointService.use(1, -1)).rejects.toThrow(
        BadRequestException,
      );
      await expect(pointService.use(1, 0)).rejects.toThrow(BadRequestException);
    });
  });
});
