import { Inject, Injectable } from '@nestjs/common';
import {
  HISTORY_REPOSITORY,
  HistoryRepository,
} from './repositories/history.repository';
import { PointHistory } from './point.model';

@Injectable()
export class HistoryService {
  constructor(
    @Inject(HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepository,
  ) {}

  async findAllByUserId(userId: number): Promise<PointHistory[]> {
    const histories = await this.historyRepository.findAllByUserId(userId);
    return histories;
  }
}
