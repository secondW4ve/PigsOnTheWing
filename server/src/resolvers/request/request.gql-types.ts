import { RequestData } from '@database/entities/request-data.entity';
import { RequestMethods } from '@enums/request-methods.enum';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { FieldError } from '@resolvers/common/common.gql-types';
import { HeaderInput } from '@resolvers/header/header.gql-types';

@InputType()
export class RequestDataInput {
  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => RequestMethods)
  method: RequestMethods;

  @Field(() => String, { nullable: true })
  body?: string;

  @Field(() => [HeaderInput], { nullable: true })
  headers: HeaderInput[];
}

@ObjectType()
export class RequestDataResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => RequestData, { nullable: true })
  request?: RequestData;
}
