import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { BookService } from './book.service';
import { Book } from '../models/book.model';

@Resolver('Book')
export class BookResolver {
  constructor(private readonly authorsService: BookService) {}

  @Query((returns) => Book)
  async getBook(@Args('id', { type: () => Int }) id: number): Promise<Book> {
    return null;
  }
}
