import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class BookInput {
  @Field()
  title: string;

  @Field((type) => [ID])
  authorIds: number[];
}
