import { PointHistoryTable } from '../../database/pointhistory.table';
import { PointHistory, TransactionType } from '../point.model';
import { Repository } from './repository.interface';

export const HISTORY_REPOSITORY = Symbol();

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

export class HistoryRepositoryImpl extends HistoryRepository {
  constructor(private readonly historyDb: PointHistoryTable) {
    super();
  }

  findById(): Promise<PointHistory> {
    throw new Error('Method not implemented.');
  }

  async create(input: HistoryCreateInput): Promise<PointHistory> {
    const result = await this.historyDb.insert(
      input.userId,
      input.amount,
      input.type,
      input.timeMillis,
    );
    return result;
  }

  save(): Promise<PointHistory> {
    throw new Error('Method not implemented.');
  }

  async findAllByUserId(userId: number): Promise<PointHistory[]> {
    const result = await this.historyDb.selectAllByUserId(userId);
    return result;
  }
}
