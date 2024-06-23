import { Module } from '@nestjs/common';
import { controllers } from './presentation';
import { services } from './application';
import { repositories } from './infra';
import { DatabaseModule } from '../database/database.module';
@Module({
  imports: [DatabaseModule],
  providers: [...services, ...repositories],
  controllers,
})
export class PointModule {}
