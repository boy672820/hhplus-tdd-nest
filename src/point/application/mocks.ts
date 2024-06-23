import { Provider } from '@nestjs/common';
import { HistoryService, PointService } from './services';
import { pointServiceMock } from './services/point.service.mock';
import { historyServiceMock } from './services/history.service.mock';

export const mocks: Provider[] = [
  {
    provide: PointService,
    useValue: pointServiceMock,
  },
  {
    provide: HistoryService,
    useValue: historyServiceMock,
  },
];
