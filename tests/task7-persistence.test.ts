import { describe, expect, it } from 'vitest';
import { Wishlist } from '../src/task7-wishlist';
import { BookCatalog } from '../src/task6-classes';

describe('Task 7: восстановление и единый источник истины', () => {
  it('восстанавливает избранное из JSON и позволяет переключать его дальше', () => {
    const original = new Wishlist();
    original.toggle('1');
    original.toggle('2');

    const saved = JSON.stringify(original.getIds());
    const restored = new Wishlist(JSON.parse(saved));
    restored.toggle('1');
    restored.toggle('3');

    expect(JSON.parse(saved)).toEqual(['1', '2']);
    expect(restored.getIds()).toEqual(['2', '3']);
    expect(original.getIds()).toEqual(['1', '2']);
  });

  it('защищает массив id от внешнего изменения и исключает повторы', () => {
    const ids = ['1', '1', '2'];
    const wishlist = new Wishlist(ids);

    ids.push('3');
    wishlist.getIds().pop();

    expect(wishlist.getIds()).toEqual(['1', '2']);
    expect(wishlist.count).toBe(2);
  });

  it('берёт актуальные данные из переданного каталога, не сохраняя старую книгу', () => {
    const wishlist = new Wishlist(['1', 'missing']);
    const catalog = new BookCatalog('main', [
      { id: '1', title: 'Первое название', authors: ['Автор'] },
    ]);

    expect(wishlist.getFavorites(catalog).map((book) => book.title))
      .toEqual(['Первое название']);

    catalog.removeBook('1');
    expect(wishlist.getFavorites(catalog)).toEqual([]);
    expect(wishlist.has('1')).toBe(true);

    catalog.addBook({ id: '1', title: 'Новое название', authors: ['Автор'] });
    expect(wishlist.getFavorites(catalog).map((book) => book.title))
      .toEqual(['Новое название']);
  });
});
