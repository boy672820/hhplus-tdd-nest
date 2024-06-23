import { Provider } from '@nestjs/common';
import InjectionToken from '../injection.token';
import { RepositoryMock } from './repositories/repository.mock';
import { HistoryRepositoryMock } from './repositories/history.repository.mock';

export const pointRepositoryProvider: Provider = {
  provide: InjectionToken.PointRepository,
  useClass: RepositoryMock,
};

export const historyRepositoryProvider: Provider = {
  provide: InjectionToken.HistoryRepository,
  useClass: HistoryRepositoryMock,
};

export const mocks: Provider[] = [
  pointRepositoryProvider,
  historyRepositoryProvider,
];
