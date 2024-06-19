import { UserPointTable } from '../database/userpoint.table';
import { UserPoint } from './point.model';
import { Repository } from './repository.interface';

export const POINT_REPOSITORY = Symbol();

export class PointRepositoryImpl implements Repository<UserPoint> {
  constructor(private readonly userDb: UserPointTable) {}

  findById(id: number): Promise<UserPoint> {
    return this.userDb.selectById(id);
  }

  save(model: UserPoint): Promise<UserPoint> {
    return this.userDb.insertOrUpdate(model.id, model.point);
  }
}
