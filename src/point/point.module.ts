import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { DatabaseModule } from 'src/database/database.module';
import { POINT_REPOSITORY, PointRepositoryImpl } from './point.repository';
import { PointService } from './point.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    PointService,
    {
      provide: POINT_REPOSITORY,
      useClass: PointRepositoryImpl,
    },
  ],
  controllers: [PointController],
})
export class PointModule {}
