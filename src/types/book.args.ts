import { ArgsType, Field } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ArgsType()
export class BookFilterArgs {
  @Field({ nullable: true })
  @IsOptional()
  title?: string;
}
