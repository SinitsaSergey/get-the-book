import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Book } from './book.model';

@Entity()
@ObjectType()
export class Author {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @ManyToMany(() => Book, (book) => book.authors)
  @JoinTable()
  books: Book[];
}
