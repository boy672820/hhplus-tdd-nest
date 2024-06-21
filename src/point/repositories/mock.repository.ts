import { PointHistory, UserPoint } from '../point.model';
import { Repository } from './repository.interface';

/**
 * Mock for Repository
 */
export class MockRepository<TModel extends UserPoint | PointHistory>
  implements Repository<TModel>
{
  findById = jest.fn();
  save = jest.fn();
}
