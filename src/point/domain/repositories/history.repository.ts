import { PointHistory, TransactionType } from '../models/point.model';
import { Repository } from './repository.interface';

export interface HistoryCreateInput {
  userId: number;
  amount: number;
  type: TransactionType;
  timeMillis: number;
}

export abstract class HistoryRepository implements Repository<PointHistory> {
  abstract findById(id: number): Promise<PointHistory>;
  abstract save(model: PointHistory): Promise<PointHistory>;
  abstract create(input: HistoryCreateInput): Promise<PointHistory>;
  abstract findAllByUserId(userId: number): Promise<PointHistory[]>;
}
