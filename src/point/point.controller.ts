import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { PointHistory, TransactionType, UserPoint } from './point.model';
import { UserPointTable } from '../database/userpoint.table';
import { PointHistoryTable } from '../database/pointhistory.table';
import { PointBody as PointDto } from './point.dto';

@Controller('/point')
export class PointController {
  constructor(
    private readonly userDb: UserPointTable,
    private readonly historyDb: PointHistoryTable,
  ) {}

  private readonly userPromiseMap = new Map<number, Promise<UserPoint>>();

  /**
   * TODO - 특정 유저의 포인트를 조회하는 기능을 작성해주세요.
   */
  @Get(':id')
  async point(@Param('id') id): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    this.validateId(id);

    const point = await this.userDb.selectById(userId);
    return point;
  }

  /**
   * TODO - 특정 유저의 포인트 충전/이용 내역을 조회하는 기능을 작성해주세요.
   */
  @Get(':id/histories')
  async history(@Param('id') id): Promise<PointHistory[]> {
    const userId = Number.parseInt(id);
    this.validateId(id);

    const histories = await this.historyDb.selectAllByUserId(userId);
    return histories;
  }

  /**
   * TODO - 특정 유저의 포인트를 충전하는 기능을 작성해주세요.
   */
  @Patch(':id/charge')
  async charge(
    @Param('id') id,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    this.validateId(id);

    const amount = pointDto.amount;

    if (amount === 0) {
      throw new BadRequestException('충전할 포인트는 0보다 커야 합니다.');
    }

    if (amount < 0) {
      throw new BadRequestException('충전할 포인트는 음수가 될 수 없습니다.');
    }

    const lastPromise = this.userPromiseMap.get(userId) || Promise.resolve();

    const newPromise = lastPromise.then(async () => {
      const user = await this.userDb.selectById(userId);
      user.point += amount;
      await this.historyDb.insert(
        userId,
        amount,
        TransactionType.CHARGE,
        Date.now(),
      );
      return this.userDb.insertOrUpdate(userId, user.point);
    });

    this.userPromiseMap.set(userId, newPromise);

    return newPromise;
  }

  /**
   * TODO - 특정 유저의 포인트를 사용하는 기능을 작성해주세요.
   */
  @Patch(':id/use')
  async use(
    @Param('id') id,
    @Body(ValidationPipe) pointDto: PointDto,
  ): Promise<UserPoint> {
    const userId = Number.parseInt(id);
    this.validateId(id);

    const amount = pointDto.amount;

    if (amount === 0) {
      throw new BadRequestException('사용할 포인트는 0보다 커야 합니다.');
    }

    if (amount < 0) {
      throw new BadRequestException('사용할 포인트는 음수가 될 수 없습니다.');
    }

    const lastPromise = this.userPromiseMap.get(userId) || Promise.resolve();

    const newPromise = lastPromise.then(async () => {
      const user = await this.userDb.selectById(userId);

      if (user.point < amount) {
        throw new UnprocessableEntityException('포인트가 부족합니다.');
      }

      await this.historyDb.insert(
        userId,
        amount,
        TransactionType.USE,
        Date.now(),
      );

      await this.userDb.insertOrUpdate(userId, user.point - amount);
      return { id: userId, point: amount, updateMillis: Date.now() };
    });

    this.userPromiseMap.set(userId, newPromise);

    return newPromise;
  }

  private validateId(id: number) {
    if (Number.isInteger(id) && id > 0) return;
    throw new BadRequestException('아이디가 올바르지 않습니다.');
  }
}
