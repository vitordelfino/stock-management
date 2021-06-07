import { ObjectId } from 'bson';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Profile {
  ADMIN = 'ADMIN',
  OTHER = 'OTHER',
}

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @ObjectIdColumn({
    type: 'uuid',
  })
  _id!: ObjectId;

  @Column()
  name!: string;

  @Column({ unique: true })
  document!: string;

  @Column()
  password!: string;

  @Column()
  profile!: Profile;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
