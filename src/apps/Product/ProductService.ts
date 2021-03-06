import { ObjectId } from 'bson';
import { CustomError } from 'express-handler-errors';
import { Service } from 'typedi';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { dbConnections } from '@config/globals';

import { LogDb, LogDBOperation } from '@apps/Logs/LogDb.entity';

import logger from '@middlewares/logger';

import { IUserRequest } from './../../config/globals';
import { Product } from './product.entity';

@Service()
export class ProductService {
  @InjectRepository(Product, dbConnections.mongo.name)
  private readonly repository!: MongoRepository<Product>;

  @InjectRepository(LogDb, dbConnections.mongo.name)
  private logdb!: MongoRepository<LogDb>;

  async create(
    product: Product,
    ip: string,
    user: IUserRequest
  ): Promise<Product> {
    try {
      logger.info(`ProductService::create::`, product);
      const response = await this.repository.save(product);
      const log = {
        ip,
        contextId: String(response._id),
        contextName: 'product',
        operation: LogDBOperation.CREATE,
        user: String(user._id),
        description: 'Inserção de novo produto',
        snapshot: response,
      } as LogDb;
      logger.info(`ProductService::create::logging operation`, log);
      await this.logdb.save(log);
      return response;
    } catch (e: any) {
      throw new CustomError({
        code: 'ERROR_CREATE_PRODUCT',
        message: 'Houve algum erro ao cadastrar novo produto ' + e.message,
        status: 500,
      });
    }
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.repository.findOne({ _id: new ObjectId(id) });
    if (!product)
      throw new CustomError({
        code: 'PRODUCT_NOT_FOUND',
        status: 404,
        message: 'Produto não encontrado',
      });
    return product;
  }

  async findByType(productTypeId: string): Promise<Product[]> {
    const response = await this.repository.find({ productTypeId });
    return response;
  }

  async update(
    id: string,
    product: Product,
    ip: string,
    user: IUserRequest
  ): Promise<Product> {
    try {
      const p = await this.findOne(id);
      await this.repository.updateOne(
        {
          _id: p._id,
        },
        { $set: { ...product } }
      );
      const log = {
        ip,
        contextId: String(p._id),
        contextName: 'product',
        operation: LogDBOperation.CREATE,
        user: String(user._id),
        description: 'Update de produto',
        snapshot: p,
      } as LogDb;
      logger.info(`ProductService::update::logging operation`, log);
      await this.logdb.save(log);
      return {
        ...p,
        ...product,
      } as Product;
    } catch (e: any) {
      if (e instanceof CustomError) throw e;
      logger.error(`ProductService::update::error - ${e.message}`, e);
      throw new CustomError({
        code: 'ERROR_UPDATE_PRODUCT',
        message: 'Erro ao atualizar o produto',
        status: 500,
      });
    }
  }
}
