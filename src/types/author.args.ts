import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class AuthorSearchArgs {
  @Field((type) => Int, { nullable: true })
  @IsOptional()
  minNumberOfBooks?: number;

  @Field((type) => Int, { nullable: true })
  @IsOptional()
  maxNumberOfBooks?: number;
}
