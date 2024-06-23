import { PointService } from './point.service';

export const pointServiceMock: PointService = {
  findById: jest.fn(),
  charge: jest.fn(),
  use: jest.fn(),
};
