import { User } from '@database/entities/user.entity';
import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { FieldError } from '@resolvers/common/common.gql-types';

@InputType()
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}
