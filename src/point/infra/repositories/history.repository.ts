import { Injectable } from '@nestjs/common';
import { PointHistoryTable } from '../../../database/pointhistory.table';
import { PointHistory } from '../../domain/models';
import {
  HistoryRepository,
  HistoryCreateInput,
} from '../../domain/repositories/history.repository';

@Injectable()
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
