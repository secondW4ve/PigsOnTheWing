import { Collection } from '@database/entities/collection.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FieldError } from '@resolvers/common/common.gql-types';

@InputType()
export class CollectionInput {
  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@ObjectType()
export class CollectionResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Collection, { nullable: true })
  collection?: Collection;
}

@ObjectType()
export class CollectionDeleteResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Boolean, { nullable: true })
  deleted?: boolean;
}
