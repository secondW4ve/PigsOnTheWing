import { Header } from '@database/entities/header.entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FieldError } from '@resolvers/common/common.gql-types';

@InputType()
export class HeaderInput {
  @Field()
  name: string;

  @Field()
  value: string;
}

@InputType()
export class HeaderInputWithRequest extends HeaderInput {
  @Field()
  requestId: string;
}

@ObjectType()
export class HeaderResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Header, { nullable: true })
  header?: Header;
}
