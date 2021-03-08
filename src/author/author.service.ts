import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Author } from '../models/author.model';
import { BaseService } from '../common/base.servise';
import { AuthorFilterArgs } from '../types/author.args';

@Injectable()
export class AuthorService extends BaseService<Author> {
  constructor(@InjectRepository(Author) protected repository: Repository<Author>) {
    super();
  }

  async findByFilter(filterArgs: AuthorFilterArgs): Promise<Author[]> {
    const { minNumberOfBooks = 0, maxNumberOfBooks = Number.MAX_SAFE_INTEGER } = filterArgs;
    const authors = await super.findAll({ relations: ['books'] });
    return authors.filter(
      (author) => author.books.length >= minNumberOfBooks && author.books.length <= maxNumberOfBooks,
    );
  }

  async deleteAuthorWithBooks(id: number): Promise<number> {
    const author = await this.repository
      .createQueryBuilder('author')
      .where({ id })
      .leftJoinAndSelect('author.books', 'books')
      .leftJoinAndSelect('books.authors', 'authors')
      .getOne();
    if (!author) {
      return 0;
    }
    if (!author.books.length) {
      return super.delete(id);
    }
    let deletedCount = 0;
    await getConnection().transaction(async (transactionalEntityManager) => {
      const removedAuthor = await transactionalEntityManager.remove(author);
      const booksToDelete = removedAuthor.books.filter((book) => book.authors.length === 1);
      await transactionalEntityManager.remove(booksToDelete);
      deletedCount += removedAuthor.books.length + 1;
    });
    return deletedCount;
  }
}
