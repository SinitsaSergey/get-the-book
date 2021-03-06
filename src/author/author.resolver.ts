import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Author } from '../models/author.model';

@Resolver('Author')
export class AuthorResolver {
  constructor(private readonly authorsService: AuthorService) {}

  @Query((returns) => Author)
  async getAuthor(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Author> {
    return null;
  }
}
