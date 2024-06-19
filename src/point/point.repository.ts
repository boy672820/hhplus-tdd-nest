import { UserPointTable } from '../database/userpoint.table';
import { UserPoint } from './point.model';
import { Repository } from './repository.interface';

export const POINT_REPOSITORY = Symbol();

export class PointRepositoryImpl implements Repository<UserPoint> {
  constructor(private readonly userDb: UserPointTable) {}

  async findById(id: number): Promise<UserPoint> {
    const result = await this.userDb.selectById(id);
    return result;
  }

  async save(model: UserPoint): Promise<UserPoint> {
    const result = await this.userDb.insertOrUpdate(model.id, model.point);
    return result;
  }
}
