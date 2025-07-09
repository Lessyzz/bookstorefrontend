import { makeAutoObservable, runInAction } from 'mobx';
import { getBooks } from '@/api/books';
import { buy, updateCartItem } from '@/api/cart';

export interface Book {
  id: number;
  title: string;
  price: number;
  photoUrl?: string;
  pageCount: number;
  publisher?: { name: string };
  author?: { name: string };
  genre?: { id: number; name: string };
}

export class BookStore {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  loading = false;
  addingToCart: { [key: number]: boolean } = {};
  cartCount = 0;
  selectedGenreId: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchBooks() {
    this.loading = true;
    try {
      const books = await getBooks();
      runInAction(() => {
        this.books = books;
        this.filteredBooks = books;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  filterByGenre(genreId: number | null) {
    this.selectedGenreId = genreId;
    if (genreId === null) {
      this.filteredBooks = this.books;
    } else {
      this.filteredBooks = this.books.filter((book) => book.genre?.id === genreId);
    }
  }

  async addToCart(bookId: number, customerId: number) {
    this.addingToCart[bookId] = true;
    try {
      await updateCartItem(customerId, customerId, bookId, 1);
      runInAction(() => {
        this.cartCount += 1;
        this.addingToCart[bookId] = false;
      });
    } catch (error) {
      runInAction(() => {
        this.addingToCart[bookId] = false;
      });
    }
  }

  get hasBooks() {
    return this.books.length > 0;
  }

  get hasFilteredBooks() {
    return this.filteredBooks.length > 0;
  }
}

export const bookStore = new BookStore();