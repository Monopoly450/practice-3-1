// ============================================================
// Практика 3: Классы и ООП
// ============================================================
// Цель: заменить функциональный каталог из Практик 2.1–2.2
// на класс с состоянием.
//
// Проверка: npm test -- task6
// ============================================================

import { Book, formatBook } from "./task1-types";
import { createBookFromForm } from "./task4-integration";
import { filterByTitle, sortBooks } from "./task5-utils";

export class BookCatalog {
  private books: Book[];
  public readonly id: string;

  constructor(id: string, books: Book[] = []) {
    this.id = id;
    this.books = [...books];
  }
  public addBook(book: Book): void {
    this.books = [...this.books, book];
  }

  public removeBook(id: string): void {
    this.books = this.books.filter((book) => book.id !== id);
  }

  public getBooks(): Book[] {
    return [...this.books];
  }

  public searchByTitle(query: string): Book[] {
    return this.books.filter(filterByTitle(query));
  }

  public sortBy(sortType: "year" | "rating"): Book[] {
    return sortBooks(this.books, sortType);
  }

  public get count(): number {
    return this.books.length;
  }
}

export class BookClass implements Book {
  public readonly id: string;
  public title: string;
  public authors: string[];
  public year?: number;
  public rating?: number;

  constructor(book: Book) {
    this.id = book.id;
    this.title = book.title;
    this.authors = [...book.authors];
    this.year = book.year;
    this.rating = book.rating;
  }

  public format(): string {
    return formatBook(this);
  }

  public static createFromFormData(formData: FormData): BookClass {
    return new BookClass(createBookFromForm(formData));
  }
}
