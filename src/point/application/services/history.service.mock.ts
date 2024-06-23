import { HistoryService } from './history.service';

export const historyServiceMock: HistoryService = {
  findAllByUserId: jest.fn(),
};
