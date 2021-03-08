import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthorHasBooksException extends HttpException {
  constructor() {
    super(
      'The author has some books. Please use deleteAuthorWithBooks(id: ID) instead',
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}

export class InvalidOrDuplicateAuthorException extends HttpException {
  constructor() {
    super('Invalid or duplicate authorId', HttpStatus.BAD_REQUEST);
  }
}

export class InvalidAuthorOrNoBooks extends HttpException {
  constructor() {
    super('The author does not exist or does not have any books', HttpStatus.BAD_REQUEST);
  }
}
