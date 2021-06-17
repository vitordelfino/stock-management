import { MongoMemoryServer } from 'mongodb-memory-server';
import { resolve } from 'path';
import request from 'supertest';
import { createConnections, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';

import app from '../../src/app';
import { dbConnections } from '../../src/config/globals';

jest.mock('../../src/middlewares/logger');
describe('User Module', () => {
  const db = new MongoMemoryServer({
    instance: {
      dbName: 'stock_managment',
    },
  });
  let user: any = {};
  beforeAll(async () => {
    console.log('connecting mongo');
    await db.start();
    const uri = await db.getUri();
    useContainer(Container);
    await createConnections([
      {
        name: dbConnections.mongo.name,
        type: 'mongodb',
        url: uri,
        entities: [resolve(__dirname, '../../src/apps/**/*.entity.ts')],
        useNewUrlParser: true,
        useUnifiedTopology: true,
        synchronize: true, // Se o ambiente for dev, o typeorm se incarrega de gerar e alterar as tabelas
      },
    ]);
  });

  afterAll(async () => {
    console.log('stop mongo');
    await db.stop();
  });

  describe('CRUD', () => {
    console.log('crud');
    test('should create an admin', async () => {
      console.log('create admin');
      const response = await request(app)
        .post('/api/users/create-admin')
        .send({
          name: 'Vitor',
          document: '42780908890',
          password: '123456',
        })
        .expect(200);
      expect(response.body.profile).toBe('ADMIN');
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Vitor');
      expect(response.body.document).toBe('42780908890');
      user = response.body;
    });

    test('should get user created', async () => {
      console.log('get user');
      await request(app).get(`/api/users/${user._id}`).expect(200, user);
    });
  });
});
