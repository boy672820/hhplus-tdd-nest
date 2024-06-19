import { PointHistory, UserPoint } from './point.model';
import { Repository } from './repository.interface';

/**
 * Mock for Repository class
 */
export class PointRepositoryMock<TModel extends UserPoint | PointHistory>
  implements Repository<TModel>
{
  findById = jest.fn();
  save = jest.fn();
}
