import { Inject, Injectable } from '@nestjs/common';
import { Repository } from './repository.interface';
import { UserPoint } from './point.model';
import { POINT_REPOSITORY } from './point.repository';

@Injectable()
export class PointService {
  constructor(
    @Inject(POINT_REPOSITORY)
    private readonly pointRepository: Repository<UserPoint>,
  ) {}
}
