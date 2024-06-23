import { Provider } from '@nestjs/common';
import InjectionToken from '../injection.token';
import { PointRepositoryImpl } from './repositories/point.repository';
import { HistoryRepositoryImpl } from './repositories/history.repository';

export const repositories: Provider[] = [
  {
    provide: InjectionToken.PointRepository,
    useClass: PointRepositoryImpl,
  },
  {
    provide: InjectionToken.HistoryRepository,
    useClass: HistoryRepositoryImpl,
  },
];
