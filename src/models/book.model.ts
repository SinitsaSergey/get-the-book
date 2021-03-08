import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Author } from './author.model';

@Entity()
@ObjectType()
export class Book {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @ManyToMany(() => Author, (author) => author.books, { cascade: ['update'] })
  authors: Author[];
}
