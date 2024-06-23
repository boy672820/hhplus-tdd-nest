import { Module } from '@nestjs/common';
import { controllers } from './presentation';
import { DatabaseModule } from 'src/database/database.module';
import { services } from './application';
import { repositories } from './infra';
@Module({
  imports: [DatabaseModule],
  providers: [...services, ...repositories],
  controllers,
})
export class PointModule {}
