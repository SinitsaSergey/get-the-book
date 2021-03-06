import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class BookArgs {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;
}
