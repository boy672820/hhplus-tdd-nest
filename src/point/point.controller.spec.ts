import { Test, TestingModule } from '@nestjs/testing';
import { PointController } from './point.controller';
import { DatabaseModule } from '../database/database.module';

describe('PointController', () => {
  let pointController: PointController;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [PointController],
    }).compile();

    pointController = moduleRef.get(PointController);
  });

  it('should be defined', () => {
    expect(pointController).toBeDefined();
  });
});
