import { makeAutoObservable, runInAction } from 'mobx';
import { getBooks } from '@/api/books';

export interface Book {
  id: number;
  title: string;
  stockQuantity: number;
  publisher?: {
    name: string;
  };
  author?: {
    name: string;
  };
  genre?: {
    id: number;
    name: string;
  };
  price: number;
  photoUrl?: string;
  pageCount: number;
}

export class AdminStore {
  books: Book[] = [];
  loading = false;
  error: string | null = null;
  editingBook: Book | null = null;
  deletingBooks: { [key: number]: boolean } = {};

  constructor() {
    makeAutoObservable(this);
  }

  async fetchBooks() {
    this.loading = true;
    this.error = null;
    
    try {
      const books = await getBooks();
      runInAction(() => {
        this.books = books;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to fetch books';
        this.loading = false;
      });
      console.error('Error fetching books:', error);
    }
  }

  setEditingBook(book: Book | null) {
    this.editingBook = book;
  }

  async deleteBook(bookId: number) {
    this.deletingBooks[bookId] = true;
    
    try {
      // API call simülasyonu - gerçek API endpoint'i ekleyin
      // await deleteBook(bookId);
      
      // Simülasyon için timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      runInAction(() => {
        this.books = this.books.filter(book => book.id !== bookId);
        this.deletingBooks[bookId] = false;
      });
    } catch (error) {
      runInAction(() => {
        this.deletingBooks[bookId] = false;
        this.error = 'Failed to delete book';
      });
      console.error('Error deleting book:', error);
    }
  }

  async updateBookStock(bookId: number, newStock: number) {
    try {
      // API call simülasyonu - gerçek API endpoint'i ekleyin
      // await updateBookStock(bookId, newStock);
      
      runInAction(() => {
        const book = this.books.find(b => b.id === bookId);
        if (book) {
          book.stockQuantity = newStock;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.error = 'Failed to update stock';
      });
      console.error('Error updating stock:', error);
    }
  }

  clearError() {
    this.error = null;
  }

  get lowStockBooks() {
    return this.books.filter(book => book.stockQuantity < 5);
  }

  get totalBooks() {
    return this.books.length;
  }

  get totalStock() {
    return this.books.reduce((total, book) => total + book.stockQuantity, 0);
  }

  get isEmpty() {
    return this.books.length === 0;
  }

  getStockStatus(quantity: number) {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 5) return 'low-stock';
    if (quantity < 20) return 'medium-stock';
    return 'high-stock';
  }

  getStockColor(quantity: number) {
    const status = this.getStockStatus(quantity);
    switch (status) {
      case 'out-of-stock': return 'text-red-500';
      case 'low-stock': return 'text-yellow-500';
      case 'medium-stock': return 'text-blue-500';
      case 'high-stock': return 'text-green-500';
      default: return 'text-gray-500';
    }
  }
}

export const adminStore = new AdminStore();