import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookResolver } from './book.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../models/book.model';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  providers: [BookService, BookResolver],
})
export class BookModule {}
