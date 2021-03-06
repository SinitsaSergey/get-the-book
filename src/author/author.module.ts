import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorResolver } from './author.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../models/author.model';

@Module({
  imports: [TypeOrmModule.forFeature([Author])],
  providers: [AuthorService, AuthorResolver],
})
export class AuthorModule {}
