import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { PointHistory, UserPoint } from '../../domain/models';
import { PointBody as PointRequeset } from '../requests/point.dto';
import { PointService } from '../../application/services/point.service';
import { HistoryService } from '../../application/services/history.service';

@Controller('/point')
export class PointController {
  constructor(
    private readonly pointService: PointService,
    private readonly historyService: HistoryService,
  ) {}

  /**
   * TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
   */
  @Get(':id')
  async point(@Param('id') id): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    const point = await this.pointService.findById(userId);
    return point;
  }

  /**
   * TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
   */
  @Get(':id/histories')
  async history(@Param('id') id): Promise<PointHistory[]> {
    const userId = Number.parseInt(id);
    const histories = await this.historyService.findAllByUserId(userId);
    return histories;
  }

  /**
   * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
   */
  @Patch(':id/charge')
  async charge(
    @Param('id') id,
    @Body(ValidationPipe) request: PointRequeset,
  ): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    const amount = request.amount;
    const point = await this.pointService.charge(userId, amount);
    return point;
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   */
  @Patch(':id/use')
  async use(
    @Param('id') id,
    @Body(ValidationPipe) request: PointRequeset,
  ): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    const amount = request.amount;
    const point = await this.pointService.use(userId, amount);
    return point;
  }
}
