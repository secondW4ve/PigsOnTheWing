import { Field, ObjectType } from '@nestjs/graphql';
import { RequestMethods } from 'src/common/enums/request-methods.enum';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Collection } from './collection.entity';
import { Header } from './header.entity';

@ObjectType()
@Index('request_pkey', ['id'], { unique: true })
@Entity('request', { schema: 'public' })
export class RequestData extends BaseEntity {
  @Field()
  @Column({
    type: 'varchar',
    name: 'name',
    nullable: false,
  })
  name: string;

  @Field()
  @Column({
    type: 'varchar',
    length: 1000,
    name: 'description',
  })
  description?: string;

  @Field(() => RequestMethods)
  @Column({
    type: 'enum',
    enum: RequestMethods,
    nullable: false,
    name: 'method',
  })
  method: RequestMethods;

  @Field()
  @Column({
    type: 'varchar',
    length: 256,
    name: 'url',
  })
  url: string;

  @Field(() => String, { nullable: true })
  @Column({
    type: 'text',
    name: 'body',
  })
  body?: string;

  @Field(() => [Header], { nullable: true })
  @OneToMany(() => Header, (header) => header.request)
  headers: Header[];

  @Field(() => Collection, { nullable: true })
  @ManyToOne(() => Collection, (collection) => collection.requests)
  @JoinColumn({ name: 'collection_id' })
  collection: Collection;
}
