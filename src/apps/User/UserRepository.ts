import { EntityRepository, MongoRepository } from 'typeorm';

import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends MongoRepository<User> {}
