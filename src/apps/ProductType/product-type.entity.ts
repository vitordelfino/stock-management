import { ObjectId } from 'bson';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity()
export class ProductType extends BaseEntity {
  @ObjectIdColumn({
    type: 'uuid',
  })
  _id!: ObjectId;

  @Column({ unique: true })
  name!: string;

  @Column()
  description!: string;
}
