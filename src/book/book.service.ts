import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { Book } from '../models/book.model';
import { BaseService } from '../common/base.servise';
import { InvalidOrDuplicateAuthorException } from '../common/error';

@Injectable()
export class BookService extends BaseService<Book> {
  constructor(@InjectRepository(Book) protected repository: Repository<Book>) {
    super();
  }

  async addAuthor(bookId: number, authorId: number): Promise<Book> {
    const book: Book = await super.findOneOrFail(bookId);
    await getManager()
      .createQueryBuilder()
      .relation(Book, 'authors')
      .of(book)
      .add(authorId)
      .catch(() => {
        throw new InvalidOrDuplicateAuthorException();
      });
    // You can return exist book object if don't need updated author in response
    return await super.findOne(bookId, { relations: ['authors'] });
  }
}
