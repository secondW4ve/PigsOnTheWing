import { Column, Entity, Index, ManyToMany, OneToMany } from 'typeorm';

import { BaseEntity } from '@database/entities/base.entity';
import { Collection } from './collection.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Index('user_pkey', ['id'], { unique: true })
@Entity('user', { schema: 'public' })
export class User extends BaseEntity {
  @Field()
  @Column({
    type: 'varchar',
    name: 'username',
    unique: true,
    nullable: false,
  })
  username: string;

  @Field()
  @Column({
    type: 'varchar',
    name: 'password',
    nullable: false,
  })
  password: string;

  @OneToMany(() => Collection, (collection) => collection.owner)
  createdCollections: Collection[];

  @ManyToMany(() => Collection, (collection) => collection.users)
  collections: Collection[];
}
