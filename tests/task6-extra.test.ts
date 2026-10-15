import { describe, expect, it } from "vitest";
import { BookCatalog, BookClass } from "../src/task6-classes";

describe("Task 6: сохранение и инкапсуляция", () => {
  it("изменение полученного массива не меняет состав каталога", () => {
    const catalog = new BookCatalog("main", [
      { id: "1", title: "TypeScript", authors: ["Alice"] },
    ]);

    catalog.getBooks().pop();

    expect(catalog.count).toBe(1);
  });

  it("после JSON можно восстановить каталог с работающими методами", () => {
    const original = new BookCatalog("saved", [
      { id: "1", title: "TypeScript", authors: ["Alice"] },
    ]);
    const parsed = JSON.parse(JSON.stringify(original));
    const restored = new BookCatalog(parsed.id, parsed.books);

    restored.addBook({ id: "2", title: "JavaScript", authors: ["Bob"] });
    restored.removeBook("1");

    expect(restored.id).toBe("saved");
    expect(restored.count).toBe(1);
    expect(restored.searchByTitle("script")[0].id).toBe("2");
    expect(original.count).toBe(1);
    expect(original.getBooks()[0].id).toBe("1");
  });
});

describe("Task 6: бонус BookClass", () => {
  function createFormData(): FormData {
    const data = new FormData();
    data.set("title", "TypeScript Guide");
    data.set("authors", " Alice, Bob, ");
    return data;
  }

  it("создаёт экземпляр из формы и форматирует книгу с годом", () => {
    const data = createFormData();
    data.set("year", "2024");
    data.set("rating", "4.5");

    const book = BookClass.createFromFormData(data);

    expect(book).toBeInstanceOf(BookClass);
    expect(book.id).toBeTruthy();
    expect(book.authors).toEqual(["Alice", "Bob"]);
    expect(book.year).toBe(2024);
    expect(book.rating).toBe(4.5);
    expect(book.format()).toBe("TypeScript Guide (2024) — Alice, Bob");
  });

  it("поддерживает форму без необязательных полей", () => {
    const book = BookClass.createFromFormData(createFormData());

    expect(book.year).toBeUndefined();
    expect(book.rating).toBeUndefined();
    expect(book.format()).toBe("TypeScript Guide — Alice, Bob");
  });

  it("сохраняет проверку рейтинга из обработчика формы", () => {
    const data = createFormData();
    data.set("rating", "6");

    expect(() => BookClass.createFromFormData(data))
      .toThrow("Рейтинг должен быть числом от 0 до 5");
  });
});
