import { PointHistory, UserPoint } from '../../domain/models';
import { Repository } from '../../domain/repositories/repository.interface';

/**
 * Mock for Repository
 */
export class RepositoryMock<TModel extends UserPoint | PointHistory>
  implements Repository<TModel>
{
  findById = jest.fn();
  save = jest.fn();
}
