import { HistoryRepository } from './history.repository';

export class HistoryMockRepository extends HistoryRepository {
  findById = jest.fn();
  save = jest.fn();
  create = jest.fn();
  findAllByUserId = jest.fn();
}
