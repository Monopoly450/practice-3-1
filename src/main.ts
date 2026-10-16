import './styles.css';
import { Book, formatBook } from './task1-types';
import { applyFilters, filterByAuthor, filterByMinYear } from './task3-filters';
import { BookCatalog, BookClass } from './task6-classes';
import { Wishlist } from './task7-wishlist';

let catalog = new BookCatalog('main', [
  { id: '1', title: 'TypeScript Guide', authors: ['John Doe'], year: 2024 },
  { id: '2', title: 'JavaScript Basics', authors: ['Jane Smith'], year: 2022 },
]);
let wishlist = new Wishlist();

// восстановление из localStorage

const saved = localStorage.getItem('catalog');
if (saved) {
  try {
    const parsed = JSON.parse(saved);
    // Восстанавливаем методы класса; поддерживаем и старый каталог-словарь.
    const books: Book[] = Array.isArray(parsed.books) ? parsed.books : Object.values(parsed);
    if (books.every((book) => typeof book.id === 'string'
      && typeof book.title === 'string' && Array.isArray(book.authors))) {
      catalog = new BookCatalog(typeof parsed.id === 'string' ? parsed.id : 'main', books);
    }
  } catch {
    // Повреждённое сохранение не должно мешать работе начального каталога.
  }
}

// В избранном сохраняются только идентификаторы, без копий книг.
const savedWishlist = localStorage.getItem('wishlist');
if (savedWishlist) {
  try {
    const favoriteIds: unknown = JSON.parse(savedWishlist);
    if (Array.isArray(favoriteIds) && favoriteIds.every((id) => typeof id === 'string')) {
      wishlist = new Wishlist(favoriteIds);
    }
  } catch {
    // При повреждённом JSON начинаем с пустого избранного.
  }
}

// сохранение В localStorage
function saveCatalog() {
  localStorage.setItem('catalog', JSON.stringify(catalog));
}

function saveWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist.getIds()));
}

// DOM-элементы
const bookList = document.querySelector('#bookList') as HTMLDivElement;
const wishlistContainer = document.querySelector('#wishlistContainer') as HTMLDivElement;
const form = document.querySelector('#bookForm') as HTMLFormElement;
const filterBtn = document.querySelector('#applyFilters') as HTMLButtonElement;
const authorInput = document.querySelector('#filterAuthor') as HTMLInputElement;
const yearInput = document.querySelector('#filterYear') as HTMLInputElement;
const errorMessage = document.querySelector('#errorMessage') as HTMLDivElement;
const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
const sortBySelect = document.querySelector('#sortBy') as HTMLSelectElement;

// Одна функция создаёт карточку для основного списка и избранного.
function createBookCard(book: Book): HTMLDivElement {
  const card = document.createElement('div');
  card.className = 'book-card';

  const titleEl = document.createElement('h3');
  titleEl.textContent = formatBook(book);
  card.append(titleEl);

  if (book.rating !== undefined) {
    const ratingEl = document.createElement('p');
    ratingEl.textContent = `Рейтинг: ${book.rating}`;
    card.append(ratingEl);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.addEventListener('click', () => {
    catalog.removeBook(book.id);
    saveCatalog();
    refreshList();
    renderWishlist();
  });
  card.append(deleteBtn);

  const favBtn = document.createElement('button');
  favBtn.textContent = wishlist.has(book.id) ? '❤️ В избранном' : '🤍 В избранное';
  favBtn.setAttribute('aria-pressed', String(wishlist.has(book.id)));
  favBtn.addEventListener('click', () => {
    wishlist.toggle(book.id);
    saveWishlist();
    refreshList();
    renderWishlist();
  });
  card.append(favBtn);

  return card;
}

// Отрисовка основного списка с учётом поиска, фильтров и сортировки.
function renderBooks(books: Book[]) {
  bookList.innerHTML = '';

  if (books.length === 0) {
    bookList.textContent = 'Книги не найдены. Попробуйте изменить фильтры.';
    return;
  }

  books.forEach(book => {
    bookList.append(createBookCard(book));
  });
}

function renderWishlist() {
  wishlistContainer.innerHTML = '';
  const favoriteBooks = wishlist.getFavorites(catalog);

  if (favoriteBooks.length === 0) {
    wishlistContainer.textContent = 'Пока ничего не добавлено';
    return;
  }

  favoriteBooks.forEach(book => {
    wishlistContainer.append(createBookCard(book));
  });
}

// Первичная отрисовка
refreshList();
renderWishlist();

// обработчик формы
form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMessage.textContent = '';
  try {
    const formData = new FormData(form);
    const newBook = BookClass.createFromFormData(formData);
    catalog.addBook(newBook);

    saveCatalog();
    form.reset();

    refreshList();
    renderWishlist();
  } catch (error) {
    if (error instanceof Error) {
      errorMessage.textContent = error.message;
    }
  }
});

// фильтры и сортировка
function refreshList() {
  const filters: ((book: Book) => boolean)[] = [];

  if (authorInput.value.trim()) filters.push(filterByAuthor(authorInput.value.trim()));
  if (yearInput.value) filters.push(filterByMinYear(parseInt(yearInput.value, 10)));
  if (searchInput.value.trim()) {
    const matchingBooks = new Set(catalog.searchByTitle(searchInput.value.trim()));
    filters.push((book) => matchingBooks.has(book));
  }

  const sortedBooks = catalog.sortBy(sortBySelect.value as 'year' | 'rating');
  renderBooks(applyFilters(sortedBooks, filters));
}

filterBtn.addEventListener('click', refreshList);
searchInput.addEventListener('input', refreshList);
sortBySelect.addEventListener('change', refreshList);
