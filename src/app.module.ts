import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { Book } from './models/book.model';
import { Author } from './models/author.model';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'rootPassword',
      database: 'test',
      autoLoadEntities: true,
      entities: [Book, Author],
      synchronize: true,
    }),
    GraphQLModule.forRoot({
      typePaths: ['schema.graphql'],
      playground: true,
    }),
    AuthorModule,
    BookModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
