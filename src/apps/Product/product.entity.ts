import { ObjectId } from 'bson';
import { BaseEntity, Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'Products' })
export class Product extends BaseEntity {
  @ObjectIdColumn({
    type: 'uuid',
  })
  _id!: ObjectId;

  @Column()
  productTypeId!: string;

  @Column()
  name!: string;

  @Column()
  image!: string;

  @Column()
  description!: string;

  @Column()
  purchasePrice!: number;

  @Column()
  salePrice!: number;
}
