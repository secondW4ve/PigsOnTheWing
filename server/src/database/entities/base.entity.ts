import { Field, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export abstract class BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;
}
