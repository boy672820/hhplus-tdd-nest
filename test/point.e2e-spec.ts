import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PointModule } from '../src/point/point.module';
import * as request from 'supertest';

describe('PointController (e2e', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [PointModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/point/:id (GET)', () => {
    it('특정 유저의 포인트를 조회할 수 있어야합니다.', async () => {
      const userId = 1;

      const response = await request(app.getHttpServer()).get(
        `/point/${userId}`,
      );

      expect(response.statusCode).toBe(200);
    });
  });

  describe('/point/:id/histories (GET)', () => {
    it('특정 유저의 포인트 내역을 조회할 수 있어야합니다.', async () => {
      const userId = 1;

      const response = await request(app.getHttpServer()).get(
        `/point/${userId}/histories`,
      );

      expect(response.statusCode).toBe(200);
    });
  });

  describe('/point/:id/charge (PATCH)', () => {
    it('특정 유저의 포인트를 충전할 수 있어야합니다.', async () => {
      const userId = 1;
      const amount = 100;

      const response = await request(app.getHttpServer())
        .patch(`/point/${userId}/charge`)
        .send({ amount });

      expect(response.statusCode).toBe(200);
    });

    describe('다음의 경우 4xx를 반환해야합니다.', () => {
      it('특정 유저의 포인트를 충전할 때 amount가 없으면 400 에러를 반환해야합니다.', async () => {
        const userId = 1;

        const response = await request(app.getHttpServer()).patch(
          `/point/${userId}/charge`,
        );

        expect(response.statusCode).toBe(400);
      });

      it('특정 유저의 포인트를 충전할 때 amount가 0보다 작으면 400 에러를 반환해야합니다.', async () => {
        const userId = 1;
        const amount = -100;

        const response = await request(app.getHttpServer())
          .patch(`/point/${userId}/charge`)
          .send({ amount });

        expect(response.statusCode).toBe(400);
      });
    });
  });

  describe('/point/:id/use (PATCH)', () => {
    it('특정 유저의 포인트를 충전한 후 사용할 수 있어야합니다.', async () => {
      const userId = 1;
      const amount = 100;

      await request(app.getHttpServer()).patch(`/point/${userId}/charge`).send({
        amount,
      });
      const response = await request(app.getHttpServer())
        .patch(`/point/${userId}/use`)
        .send({ amount });

      expect(response.statusCode).toBe(200);
    });

    describe('다음의 경우 4xx를 반환해야합니다.', () => {
      it('특정 유저의 포인트를 사용할 때 amount가 없으면 400 에러를 반환해야합니다.', async () => {
        const userId = 1;

        const response = await request(app.getHttpServer()).patch(
          `/point/${userId}/use`,
        );

        expect(response.statusCode).toBe(400);
      });

      it('특정 유저의 포인트를 사용할 때 amount가 0보다 작으면 400 에러를 반환해야합니다.', async () => {
        const userId = 1;
        const amount = -100;

        const response = await request(app.getHttpServer())
          .patch(`/point/${userId}/use`)
          .send({ amount });

        expect(response.statusCode).toBe(400);
      });

      it('특정 유저의 포인트를 충전하지 않고 사용하면 400 에러를 반환해야합니다.', async () => {
        const userId = 1;
        const amount = 100;

        const response = await request(app.getHttpServer())
          .patch(`/point/${userId}/use`)
          .send({ amount });

        expect(response.statusCode).toBe(422);
      });
    });
  });
});
