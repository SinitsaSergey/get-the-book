import { AuthorInput } from '../src/types/author.input';
import { BookInput } from '../src/types/book.input';

export class TestUtils {
  createAuthorQuery(input: AuthorInput) {
    return `
  mutation {
    createAuthor(author: {
      firstName: "${input.firstName}",
      lastName: "${input.lastName}"
    }) {
      id
      firstName
      lastName
    }
  }`;
  }

  getAuthorQuery(id: number) {
    return `query {getAuthor(id: ${id}) {
      id, firstName, lastName, books {id, title}
  }}`;
  }

  getAuthorsQuery(minNumberOfBooks: number, maxNumberOfBooks: number) {
    return `query {getAuthors (minNumberOfBooks:${minNumberOfBooks},maxNumberOfBooks:${maxNumberOfBooks}) {
    id,
    firstName,
    lastName,
    books{
      id
      title
    }
  }}`;
  }

  getAllAuthorsQuery() {
    return `query {getAuthors {
    id,
    firstName,
    lastName,
    books{
      id
      title
    }
  }}`;
  }

  deleteAuthorQuery(id: number) {
    return `mutation{deleteAuthor(id: ${id})}`;
  }

  deleteAuthorWithBooksQuery(id: number) {
    return `mutation{deleteAuthorWithBooks(id: ${id})}`;
  }

  createBookQuery(bookInput: BookInput) {
    return `mutation{createBook(book:{
    title: "${bookInput.title}",
    authorIds: [${bookInput.authorIds}]
  }){
    id
  }}`;
  }

  getBookQuery(id: number) {
    return `query{getBook(id: ${id}){
    id, title, authors {id, firstName, lastName}
  }}`;
  }

  getBooksQuery(title: string) {
    return `query{getBooks (title: "${title}") {
    id,title, authors {id, firstName, lastName}
  }}`;
  }

  getAllBooksQuery() {
    return `query{getBooks {
    id,title, authors {id, firstName, lastName}
  }}`;
  }

  deleteBookQuery(id: number) {
    return `mutation {deleteBook(id: ${id})}`;
  }

  addAuthorQuery(bookId: number, authorId: number) {
    return `mutation {addAuthor (bookId: ${bookId}, authorId: ${authorId}) {
    id, title, authors{
      id
    }
  }}`;
  }
}
