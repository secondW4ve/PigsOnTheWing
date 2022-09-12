import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RequestData } from './request-data.entity';

@ObjectType()
@Index('header_pkey', ['id'], { unique: true })
@Entity('header', { schema: 'public' })
export class Header extends BaseEntity {
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
    name: 'value',
    nullable: false,
  })
  value: string;

  @Field(() => RequestData)
  @ManyToOne(() => RequestData, (request) => request.headers)
  @JoinColumn([{ name: 'request_id', referencedColumnName: 'id' }])
  request: RequestData;
}
