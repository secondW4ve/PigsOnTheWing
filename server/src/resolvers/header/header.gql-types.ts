import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class HeaderInput {
  @Field()
  name: string;

  @Field()
  value: string;
}
