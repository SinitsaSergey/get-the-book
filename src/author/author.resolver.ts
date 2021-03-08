import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthorService } from './author.service';
import { Author } from '../models/author.model';
import { AuthorFilterArgs } from '../types/author.args';
import { AuthorHasBooksException } from '../common/error';

@Resolver('Author')
export class AuthorResolver {
  constructor(private readonly authorsService: AuthorService) {}

  @Query(() => Author)
  async getAuthor(@Args('id', { type: () => ID }) id: number): Promise<Author> {
    return this.authorsService.findOne(id, { relations: ['books'] });
  }

  @Query(() => [Author])
  async getAuthors(@Args() authorFilterArgs: AuthorFilterArgs): Promise<Author[]> {
    return this.authorsService.findByFilter(authorFilterArgs);
  }

  @Mutation(() => Author)
  async createAuthor(@Args('author', { type: () => Author }) author: Author): Promise<Author> {
    return this.authorsService.save(author);
  }

  @Mutation(() => Int)
  async deleteAuthor(@Args('id', { type: () => ID }) id: number): Promise<number> {
    const author: Author = await this.authorsService.findOneOrFail(id);
    // You can remove the query and the condition if books without authors are allowed
    if (author.books.length > 0) {
      throw new AuthorHasBooksException();
    }
    return this.authorsService.delete(id);
  }

  @Mutation(() => Int)
  async deleteAuthorWithBooks(@Args('id', { type: () => ID }) id: number): Promise<number> {
    return this.authorsService.deleteAuthorWithBooks(id);
  }
}
