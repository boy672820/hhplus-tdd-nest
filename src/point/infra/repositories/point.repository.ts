import { Injectable } from '@nestjs/common';
import { UserPointTable } from '../../../database/userpoint.table';
import { UserPoint } from '../../domain/models';
import { Repository } from '../../domain/repositories/repository.interface';

@Injectable()
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
