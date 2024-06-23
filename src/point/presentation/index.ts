import { Type } from '@nestjs/common';
import { PointController } from './controllers/point.controller';

type Controller = Type<any>;

export const controllers: Controller[] = [PointController];
