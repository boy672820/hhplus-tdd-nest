import { Module } from '@nestjs/common';
import { PointController } from './point.controller';
import { DatabaseModule } from 'src/database/database.module';
import { POINT_REPOSITORY, PointRepositoryImpl } from './point.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: POINT_REPOSITORY,
      useClass: PointRepositoryImpl,
    },
  ],
  controllers: [PointController],
})
export class PointModule {}
