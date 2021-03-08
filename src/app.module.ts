import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { Book } from './models/book.model';
import { Author } from './models/author.model';
import { AppController } from './app.controller';
import * as depthLimit from 'graphql-depth-limit';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.TYPEORM_HOST || 'localhost',
      port: +process.env.TYPEORM_PORT || 3306,
      username: process.env.TYPEORM_USERNAME || 'root',
      password: process.env.TYPEORM_PASSWORD || 'rootPassword',
      database: process.env.TYPEORM_DATABASE || 'demo',
      autoLoadEntities: true,
      entities: [Book, Author],
      synchronize: true,
      logging: ['error'],
    }),
    GraphQLModule.forRoot({
      typePaths: ['schema.graphql'],
      playground: true,
      validationRules: [depthLimit(3)],
    }),
    AuthorModule,
    BookModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
