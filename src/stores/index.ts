import { createContext, useContext } from 'react';
import { BookStore } from '@/stores/BookStore';
import { CartStore } from '@/stores/CartStore';
import { AdminStore } from '@/stores/AdminStore';

export class RootStore {
  bookStore: BookStore;
  cartStore: CartStore;
  adminStore: AdminStore;

  constructor() {
    this.bookStore = new BookStore();
    this.cartStore = new CartStore();
    this.adminStore = new AdminStore();
  }
}

export const rootStore = new RootStore();
export const StoreContext = createContext(rootStore);
export const useStore = () => useContext(StoreContext);