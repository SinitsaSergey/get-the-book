import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book } from '../models/book.model';
import { BookInput } from '../types/book.input';
import { Author } from '../models/author.model';
import { getManager, Like } from 'typeorm';
import { BookFilterArgs } from '../types/book.args';

@Resolver('Book')
export class BookResolver {
  constructor(private readonly bookService: BookService) {}

  @Query(() => Book)
  async getBook(@Args('id', { type: () => ID }) id: number): Promise<Book> {
    return this.bookService.findOne(id, { relations: ['authors'] });
  }

  @Query(() => [Book])
  async getBooks(@Args() bookFilterArgs: BookFilterArgs): Promise<Book[]> {
    const { title = '%' } = bookFilterArgs;
    return this.bookService.findAll({ relations: ['authors'], where: { title: Like(title) } });
  }

  @Mutation(() => Book)
  async createBook(@Args('book', { type: () => BookInput }) bookInput: BookInput): Promise<Book> {
    return this.bookService.save({
      id: undefined,
      title: bookInput.title,
      authors: await getManager().findByIds(Author, bookInput.authorIds),
    });
  }

  @Mutation(() => Int)
  async deleteBook(@Args('id', { type: () => ID }) id: number): Promise<number> {
    return this.bookService.delete(id);
  }

  @Mutation(() => Book)
  async addAuthor(
    @Args({ name: 'bookId', type: () => ID }) bookId: number,
    @Args({ name: 'authorId', type: () => ID }) authorId: number,
  ): Promise<Book> {
    return this.bookService.addAuthor(bookId, authorId);
  }
}
