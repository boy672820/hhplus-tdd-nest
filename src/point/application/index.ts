import { Provider } from '@nestjs/common';
import {
  HistoryService,
  HistoryServiceImpl,
  PointService,
  PointServiceImpl,
} from './services';

export const services: Provider[] = [
  {
    provide: PointService,
    useClass: PointServiceImpl,
  },
  {
    provide: HistoryService,
    useClass: HistoryServiceImpl,
  },
];
