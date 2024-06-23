import {
  BadRequestException,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { TransactionType, UserPoint } from '../../domain/models';
import { WithLock } from '../../../lib/decorators';
import { Repository } from '../../domain/repositories/repository.interface';
import InjectionToken from '../../injection.token';
import { HistoryRepository } from '../../domain/repositories';

export abstract class PointService {
  abstract findById(userId: number): Promise<UserPoint>;
  abstract charge(userId: number, point: number): Promise<UserPoint>;
  abstract use(userId: number, point: number): Promise<UserPoint>;
}

@Injectable()
export class PointServiceImpl implements PointService {
  constructor(
    @Inject(InjectionToken.PointRepository)
    private readonly pointRepository: Repository<UserPoint>,
    @Inject(InjectionToken.HistoryRepository)
    private readonly historyRepository: HistoryRepository,
  ) {}

  async findById(userId: number): Promise<UserPoint> {
    const point = await this.pointRepository.findById(userId);
    return point;
  }

  @WithLock()
  async charge(userId: number, point: number): Promise<UserPoint> {
    if (point <= 0) {
      throw new BadRequestException();
    }

    const userPoint = await this.pointRepository.findById(userId);
    userPoint.point += point;
    userPoint.updateMillis = Date.now();

    await this.pointRepository.save(userPoint);

    await this.historyRepository.create({
      userId,
      amount: point,
      type: TransactionType.CHARGE,
      timeMillis: Date.now(),
    });

    return userPoint;
  }

  @WithLock()
  async use(userId: number, point: number): Promise<UserPoint> {
    if (point <= 0) {
      throw new BadRequestException();
    }

    const userPoint = await this.pointRepository.findById(userId);

    if (userPoint.point < point) {
      throw new UnprocessableEntityException();
    }

    userPoint.point -= point;
    userPoint.updateMillis = Date.now();

    await this.pointRepository.save(userPoint);

    await this.historyRepository.create({
      userId,
      amount: point,
      type: TransactionType.USE,
      timeMillis: Date.now(),
    });

    return userPoint;
  }
}
