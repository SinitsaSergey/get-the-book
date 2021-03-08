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

describe('AuthorController', () => {
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

  it('author should be created', async () => {
    const firstName = 'Lev';
    const lastName = 'Tolstoy';
    const { createAuthor } = (await executeQuery(testUtils.createAuthorQuery({ firstName, lastName }))).body.data;
    expect(createAuthor.id).toBeDefined();
    expect(createAuthor.firstName).toBe(firstName);
    expect(createAuthor.lastName).toBe(lastName);
  });

  it('author should be presented', async () => {
    const firstName = 'Alexandr';
    const lastName = 'Pushkin';
    const { id } = (await executeQuery(testUtils.createAuthorQuery({ firstName, lastName }))).body.data.createAuthor;
    const { getAuthor } = (await executeQuery(testUtils.getAuthorQuery(id))).body.data;
    expect(getAuthor.firstName).toBe(firstName);
    expect(getAuthor.lastName).toBe(lastName);
  });

  it('list of authors should be presented', async () => {
    await executeQuery(testUtils.createAuthorQuery({ firstName: 'Lev', lastName: 'Tolstoy' }));
    await executeQuery(testUtils.createAuthorQuery({ firstName: 'Alexandr', lastName: 'Pushkin' }));

    expect((await executeQuery(testUtils.getAllAuthorsQuery())).body.data.getAuthors).toEqual([
      { books: [], firstName: 'Lev', id: '1', lastName: 'Tolstoy' },
      { books: [], firstName: 'Alexandr', id: '2', lastName: 'Pushkin' },
    ]);
  });

  it('list of authors should be filtered', async () => {
    const id = (await executeQuery(testUtils.createAuthorQuery({ firstName: 'Lev', lastName: 'Tolstoy' }))).body.data
      .createAuthor.id;
    await executeQuery(testUtils.createAuthorQuery({ firstName: 'Alexandr', lastName: 'Pushkin' }));
    await executeQuery(testUtils.createBookQuery({ title: 'War and peace', authorIds: [id] }));

    expect((await executeQuery(testUtils.getAuthorsQuery(0, 1))).body.data.getAuthors.length).toBe(2);
    expect((await executeQuery(testUtils.getAuthorsQuery(2, 3))).body.data.getAuthors.length).toBe(0);

    const { getAuthors } = (await executeQuery(testUtils.getAuthorsQuery(1, 1))).body.data;
    expect(getAuthors.length).toBe(1);
    expect(getAuthors[0].id).toBe(id);
  });

  it('author should be deleted', async () => {
    const firstName = 'Alexandr';
    const lastName = 'Pushkin';
    const { id } = (await executeQuery(testUtils.createAuthorQuery({ firstName, lastName }))).body.data.createAuthor;

    expect((await executeQuery(testUtils.deleteAuthorQuery(id))).body.data.deleteAuthor).toBe(1);
    expect((await executeQuery(testUtils.getAuthorQuery(id))).body.data.getAuthor).toBe(null);
  });

  it('author should be deleted with books', async () => {
    const authorId1 = (await executeQuery(testUtils.createAuthorQuery({ firstName: 'Lev', lastName: 'Tolstoy' }))).body
      .data.createAuthor.id;
    const authorId2 = (await executeQuery(testUtils.createAuthorQuery({ firstName: 'Unknown', lastName: 'Author' })))
      .body.data.createAuthor.id;
    const bookId1 = (await executeQuery(testUtils.createBookQuery({ title: 'War and peace', authorIds: [authorId1] })))
      .body.data.createBook.id;
    const bookId2 = (
      await executeQuery(testUtils.createBookQuery({ title: 'Some book', authorIds: [authorId1, authorId2] }))
    ).body.data.createBook.id;

    expect((await executeQuery(testUtils.deleteAuthorWithBooksQuery(authorId1))).body.data.deleteAuthorWithBooks).toBe(
      3,
    );
    expect((await executeQuery(testUtils.getBookQuery(bookId1))).body.data.getBook).toBe(null);
    expect((await executeQuery(testUtils.getBookQuery(bookId2))).body.data.getBook.authors.length).toBe(1);
  });
});
