import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from './repository.interface';
import { UserPoint } from './point.model';
import { POINT_REPOSITORY } from './point.repository';

@Injectable()
export class PointService {
  constructor(
    @Inject(POINT_REPOSITORY)
    private readonly pointRepository: Repository<UserPoint>,
  ) {}

  async charge(userId: number, point: number): Promise<UserPoint> {
    if (point <= 0) {
      throw new BadRequestException();
    }

    const userPoint = await this.pointRepository.findById(userId);
    userPoint.point += point;
    await this.pointRepository.save(userPoint);
    userPoint.updateMillis = Date.now();
    return userPoint;
  }
}
