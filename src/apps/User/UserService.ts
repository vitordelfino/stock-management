import { ObjectId } from 'bson';
import { CustomError } from 'express-handler-errors';
import { Service } from 'typedi';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { dbConnections } from '@config/globals';

import logger from '@middlewares/logger';

import { LogDb, LogDBOperation } from './../Logs/LogDb.entity';
import { Profile, User } from './user.entity';

@Service()
export class UserService {
  @InjectRepository(User, dbConnections.mongo.name)
  private repository!: MongoRepository<User>;

  @InjectRepository(LogDb, dbConnections.mongo.name)
  private logdb!: MongoRepository<LogDb>;

  async create(user: User): Promise<User> {
    const response = await this.repository.save(user);
    return response;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repository.findOne({ _id: new ObjectId(id) });
    logger.info('user', { user });
    if (!user)
      throw new CustomError({
        code: 'USER_NOT_FOUND',
        status: 404,
        message: 'Usuário não encontrado',
      });

    return user;
  }

  async update(id: string, updates: User): Promise<User> {
    const user = await this.findOne(id);
    await this.repository.updateOne(
      { _id: user._id },
      { $set: { ...updates } }
    );
    const response = await this.findOne(id);
    return response;
  }

  async createAdmin(user: User, ip: string): Promise<User> {
    try {
      logger.info(`UserService::createAdmin::creating user`, user);
      const response = await this.repository.save({
        ...user,
        profile: Profile.ADMIN,
      });
      const log = {
        ip,
        contextId: String(response._id),
        contextName: 'user',
        operation: LogDBOperation.CREATE,
        user: String(response._id),
        description: 'Exclusão de usuário',
        snapshot: response,
      } as LogDb;
      logger.info(`UserService::createAdmin::logging operation`, log);
      await this.logdb.save(log);
      return response;
    } catch (e) {
      if (e.code === 11000)
        throw new CustomError({
          code: 'USER_ALREADY_EXISTS',
          message: 'Usuário ja existente',
          status: 409,
        });
      console.log('@@@@@@', e);
      throw new CustomError({
        code: 'ERROR_CREATE_USER',
        message: 'Houve algum erro ao cadastrar novo usuário' + e.message,
        status: 500,
      });
    }
  }
}
