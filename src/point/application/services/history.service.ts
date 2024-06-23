import { Inject, Injectable } from '@nestjs/common';
import { PointHistory } from '../../domain/models';
import { HistoryRepository } from '../../domain/repositories';
import InjectionToken from '../../injection.token';

export abstract class HistoryService {
  abstract findAllByUserId(userId: number): Promise<PointHistory[]>;
}

@Injectable()
export class HistoryServiceImpl implements HistoryService {
  constructor(
    @Inject(InjectionToken.HistoryRepository)
    private readonly historyRepository: HistoryRepository,
  ) {}

  async findAllByUserId(userId: number): Promise<PointHistory[]> {
    const histories = await this.historyRepository.findAllByUserId(userId);
    return histories;
  }
}
