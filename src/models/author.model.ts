import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Book } from './book.model';

@Entity()
@ObjectType()
export class Author {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @ManyToMany(() => Book, (book) => book.authors, { eager: true })
  @JoinTable({ name: 'books_authors', joinColumns: [{ name: 'author_id' }], inverseJoinColumns: [{ name: 'book_id' }] })
  books: Book[];
}
