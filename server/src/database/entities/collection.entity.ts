import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { RequestData } from './request-data.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Index('collection', ['id'], { unique: true })
@Entity('collection', { schema: 'public' })
export class Collection extends BaseEntity {
  @Field()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 1000,
  })
  description: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.createdCollections, {
    eager: true,
    cascade: true,
  })
  @JoinColumn([{ name: 'owner_id', referencedColumnName: 'id' }])
  owner: User;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user.collections, { cascade: true })
  @JoinTable({
    name: 'user_collection',
    joinColumn: {
      name: 'collection_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @Field(() => [RequestData])
  @OneToMany(() => RequestData, (request) => request.collection)
  requests: RequestData[];
}
