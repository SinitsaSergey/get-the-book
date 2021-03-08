import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class AuthorFilterArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  minNumberOfBooks?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  maxNumberOfBooks?: number;
}
