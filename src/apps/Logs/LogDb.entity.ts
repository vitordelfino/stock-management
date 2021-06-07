import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
} from 'typeorm';

export enum LogDBOperation {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  FIND = 'FIND',
}

@Entity()
export class LogDb extends BaseEntity {
  @ObjectIdColumn({
    type: 'uuid',
  })
  _id!: string;

  @Column()
  ip!: string;

  /**
   *
   * Id do recurso que está sendo alterado, (order, user, etc...)
   * @type {string}
   * @memberof LogDb
   */
  @Column()
  contextId!: string;

  /**
   *
   * Nome do recurso que está sendo alterado, (order, user, etc...)
   * @type {string}
   * @memberof LogDb
   */
  @Column()
  contextName!: string;

  @Column()
  operation!: LogDBOperation;

  /**
   *
   * Id do usuário que efetua a operação (obter pelo token)
   * @type {string}
   * @memberof LogDb
   */
  @Column()
  user!: string;

  @Column()
  description!: string;

  /**
   * Objeto antes da alteração
   *
   * @type {*}
   * @memberof LogDb
   */
  @Column()
  snapshot!: any;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt!: Date;
}
