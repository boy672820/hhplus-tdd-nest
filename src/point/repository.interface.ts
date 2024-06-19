import { PointHistory, UserPoint } from './point.model';

export interface Repository<TModel extends UserPoint | PointHistory> {
  findById(id: number): Promise<TModel>;
  save(model: TModel): Promise<TModel>;
}
