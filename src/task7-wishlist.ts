import type { Book } from './task1-types';
import type { BookCatalog } from './task6-classes';

export class Wishlist {
  private favoriteIds: string[] = [];

  constructor(favoriteIds: string[] = []) {
    // Копируем массив и исключаем повторы при восстановлении сохранения.
    this.favoriteIds = [...new Set(favoriteIds)];
  }

  public toggle(id: string): void {
    if (this.has(id)) {
      this.favoriteIds = this.favoriteIds.filter((favoriteId) => favoriteId !== id);
    } else {
      this.favoriteIds = [...this.favoriteIds, id];
    }
  }

  public has(id: string): boolean {
    return this.favoriteIds.includes(id);
  }

  public getFavorites(catalog: BookCatalog): Book[] {
    return catalog.getBooks().filter((book) => this.has(book.id));
  }

  public getIds(): string[] {
    // Внешний код получает копию и не может менять состав избранного напрямую.
    return [...this.favoriteIds];
  }

  public get count(): number {
    return this.favoriteIds.length;
  }
}
