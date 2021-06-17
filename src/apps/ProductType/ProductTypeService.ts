import { ObjectId } from 'bson';
import { CustomError } from 'express-handler-errors';
import { Service } from 'typedi';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { dbConnections } from '@config/globals';

import { LogDb, LogDBOperation } from '@apps/Logs/LogDb.entity';

import logger from '@middlewares/logger';

import { IUserRequest } from './../../config/globals';
import { ProductType } from './product-type.entity';

@Service()
export class ProductTypeService {
  @InjectRepository(ProductType, dbConnections.mongo.name)
  private readonly repository!: MongoRepository<ProductType>;

  @InjectRepository(LogDb, dbConnections.mongo.name)
  private logdb!: MongoRepository<LogDb>;

  async create(
    product: ProductType,
    ip: string,
    user: IUserRequest
  ): Promise<ProductType> {
    try {
      logger.info(`ProductTypeService::create::`, product);
      const response = await this.repository.save(product);
      const log = {
        ip,
        contextId: String(response._id),
        contextName: 'product-type',
        operation: LogDBOperation.CREATE,
        user: String(user._id),
        description: 'Inserção de tipo de produto',
        snapshot: response,
      } as LogDb;
      logger.info(`ProductTypeService::createAdmin::logging operation`, log);
      await this.logdb.save(log);
      return response;
    } catch (e: any) {
      throw new CustomError({
        code: 'ERROR_CREATE_PRODUCT_TYPE',
        message:
          'Houve algum erro ao cadastrar novo tipo de produto ' + e.message,
        status: 500,
      });
    }
  }

  async findOne(id: string): Promise<ProductType> {
    const productType = await this.repository.findOne({
      _id: new ObjectId(id),
    });
    if (!productType)
      throw new CustomError({
        code: 'PRODUCT_TYPE_NOT_FOUND',
        status: 404,
        message: 'Produto não encontrado',
      });
    return productType;
  }

  async list(): Promise<ProductType[]> {
    const response = await this.repository.find();
    return response;
  }
}
