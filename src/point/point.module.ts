import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { DatabaseModule } from 'src/database/database.module';
import {
  POINT_REPOSITORY,
  PointRepositoryImpl,
} from './repositories/point.repository';
import { PointService } from './point.service';
import {
  HISTORY_REPOSITORY,
  HistoryRepositoryImpl,
} from './repositories/history.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    PointService,
    {
      provide: POINT_REPOSITORY,
      useClass: PointRepositoryImpl,
    },
    {
      provide: HISTORY_REPOSITORY,
      useClass: HistoryRepositoryImpl,
    },
  ],
  controllers: [PointController],
})
export class PointModule {}
