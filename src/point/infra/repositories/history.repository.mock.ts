import { HistoryRepository } from '../../domain/repositories';

export class HistoryRepositoryMock extends HistoryRepository {
  findById = jest.fn();
  save = jest.fn();
  create = jest.fn();
  findAllByUserId = jest.fn();
}
