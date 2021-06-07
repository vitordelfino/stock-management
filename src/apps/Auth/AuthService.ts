import { CustomError } from 'express-handler-errors';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { auth, dbConnections } from '@config/globals';

import { User } from '@apps/User/user.entity';

import logger from '@middlewares/logger';

@Service()
export class AuthService {
  @InjectRepository(User, dbConnections.mongo.name)
  private readonly repository!: MongoRepository<User>;

  async auth(document: string, password: string) {
    try {
      const user = await this.repository.findOne({
        document,
        password,
      });
      if (!user)
        throw new CustomError({
          code: 'INVALID_CREDENTIALS',
          message: 'Credenciais inválidas',
          status: 400,
        });
      logger.info(`AuthService::auth::encrypt`, user);
      const token = await sign(
        {
          _id: user._id,
          document: user.document,
          name: user.name,
          profile: user.profile,
        },
        auth.secret,
        {
          expiresIn: auth.expires,
        }
      );

      return {
        user,
        token,
      };
    } catch (e) {
      logger.error(`AuthService::auth::error::${e.message}`);
      if (e instanceof CustomError) throw e;
      throw new CustomError({
        code: 'AUTH_ERROR',
        message: 'Houve um erro ao validar as credenciais de acesso',
        status: 500,
      });
    }
  }
}
