import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AuthorModule } from '../src/author/author.module';
import { BookModule } from '../src/book/book.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../src/models/book.model';
import { Author } from '../src/models/author.model';
import { GraphQLModule } from '@nestjs/graphql';
import * as depthLimit from 'graphql-depth-limit';
import { TestUtils } from './testUtils';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';

describe('BookController', () => {
  let app: INestApplication;
  const testUtils = new TestUtils();
  const executeQuery = (query: string) => {
    return request(app.getHttpServer()).post('/graphql').send({ query });
  };
  const truncateTables = async () => {
    const conn = getConnection();
    await conn.query('SET FOREIGN_KEY_CHECKS = 0;');
    await conn.query('TRUNCATE table test.books_authors;');
    await conn.query('TRUNCATE table test.author;');
    await conn.query('TRUNCATE table test.book; ');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1;');
  };
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.TYPEORM_HOST || 'localhost',
          port: +process.env.TYPEORM_PORT || 3306,
          username: process.env.TYPEORM_USERNAME || 'root',
          password: process.env.TYPEORM_PASSWORD || 'rootPassword',
          database: process.env.TYPEORM_DATABASE || 'test',
          autoLoadEntities: true,
          entities: [Book, Author],
          synchronize: true,
        }),
        GraphQLModule.forRoot({
          typePaths: ['schema.graphql'],
          playground: true,
          validationRules: [depthLimit(3)],
        }),
        AuthorModule,
        BookModule,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    await truncateTables();
  });

  afterEach(async () => {
    await truncateTables();
  });

  afterAll(async () => {
    await app.close();
  });

  it('book should be created', async () => {
    const authorId = (await executeQuery(testUtils.createAuthorQuery({ firstName: 'Lev', lastName: 'Tolstoy' }))).body
      .data.createAuthor.id;
    const title = 'War and Peace';
    const bookId = (await executeQuery(testUtils.createBookQuery({ title, authorIds: [authorId] }))).body.data
      .createBook.id;
    const { getBook } = (await executeQuery(testUtils.getBookQuery(bookId))).body.data;
    expect(getBook.id).toBe(bookId);
    expect(getBook.title).toBe(title);
  });

  it('list of books should be presented', async () => {
    const authorId = (await executeQuery(testUtils.createAuthorQuery({ firstName: 'Lev', lastName: 'Tolstoy' }))).body
      .data.createAuthor.id;
    await executeQuery(testUtils.createBookQuery({ title: 'War and Peace', authorIds: [authorId] }));
    await executeQuery(testUtils.createBookQuery({ title: 'Anna Karenina', authorIds: [authorId] }));
    const { getBooks } = (await executeQuery(testUtils.getAllBooksQuery())).body.data;
    expect(getBooks.length).toBe(2);
  });

  it('books should be filtered', async () => {
    const authorId = (await executeQuery(testUtils.createAuthorQuery({ firstName: 'Lev', lastName: 'Tolstoy' }))).body
      .data.createAuthor.id;
    await executeQuery(testUtils.createBookQuery({ title: 'War and Peace', authorIds: [authorId] }));
    await executeQuery(testUtils.createBookQuery({ title: 'War and War', authorIds: [authorId] }));
    expect((await executeQuery(testUtils.getBooksQuery('War and%'))).body.data.getBooks.length).toBe(2);
    expect((await executeQuery(testUtils.getBooksQuery('WAR AND PEACE'))).body.data.getBooks.length).toBe(1);
  });

  it('book should be deleted', async () => {
    const authorId = (await executeQuery(testUtils.createAuthorQuery({ firstName: 'Lev', lastName: 'Tolstoy' }))).body
      .data.createAuthor.id;
    const bookId = (await executeQuery(testUtils.createBookQuery({ title: 'War and Peace', authorIds: [authorId] })))
      .body.data.createBook.id;
    expect((await executeQuery(testUtils.deleteBookQuery(bookId))).body.data.deleteBook).toBe(1);
  });

  it('author should be added', async () => {
    const authorId1 = (await executeQuery(testUtils.createAuthorQuery({ firstName: 'Lev', lastName: 'Tolstoy' }))).body
      .data.createAuthor.id;
    const authorId2 = (await executeQuery(testUtils.createAuthorQuery({ firstName: 'Unknown', lastName: 'Author' })))
      .body.data.createAuthor.id;
    const bookId = (await executeQuery(testUtils.createBookQuery({ title: 'War and Peace', authorIds: [authorId1] })))
      .body.data.createBook.id;
    const { addAuthor } = (await executeQuery(testUtils.addAuthorQuery(bookId, authorId2))).body.data;
    expect(addAuthor.authors.length).toBe(2);
  });
});
