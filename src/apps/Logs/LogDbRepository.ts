import { EntityRepository, MongoRepository } from 'typeorm';

import { LogDb } from './LogDb.entity';

@EntityRepository(LogDb)
export class LogDbRepository extends MongoRepository<LogDb> {}
