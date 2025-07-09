import { makeAutoObservable, runInAction } from 'mobx';
import { buy, getCart, updateCartItem } from '@/api/cart';
import { bookStore } from './BookStore';

export interface CartItem {
  id: number;
  quantity: number;
  book: {
    id: number;
    title: string;
    price: number;
  };
}

export class CartStore {
  cart: CartItem[] = [];
  loading = false;
  updatingItems: { [key: number]: boolean } = {};

  constructor() {
    makeAutoObservable(this);
  }

  async fetchCart(customerId: number) {
    this.loading = true;
    try {
      const data = await getCart(customerId);
      runInAction(() => {
        this.cart = data;
        this.loading = false;
      });
    } catch (error) {
      console.error('Sepet verisi alınamadı:', error);
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async increaseQuantity(itemId: number, customerId: number) {
    const item = this.cart.find(item => item.id === itemId);
    if (!item) return;

    this.updatingItems[itemId] = true;
    try {
      await updateCartItem(customerId, customerId, item.book.id, 1);
      runInAction(() => {
        const cartItem = this.cart.find(item => item.id === itemId);
        if (cartItem) {
          cartItem.quantity += 1;
        }
        this.updatingItems[itemId] = false;
      });
    } catch (error) {
      console.error('Miktar artırılamadı:', error);
      runInAction(() => {
        this.updatingItems[itemId] = false;
      });
    }
  }

  async decreaseQuantity(itemId: number, customerId: number) {
    const item = this.cart.find(item => item.id === itemId);
    if (!item) return;

    this.updatingItems[itemId] = true;
    try {
      await updateCartItem(customerId, customerId, item.book.id, -1);
      runInAction(() => {
        const cartItem = this.cart.find(item => item.id === itemId);
        if (cartItem) {
          if (cartItem.quantity <= 1) {
            this.cart = this.cart.filter(item => item.id !== itemId);
          } else {
            cartItem.quantity -= 1;
          }
        }
        this.updatingItems[itemId] = false;
      });
    } catch (error) {
      console.error('Miktar azaltılamadı:', error);
      runInAction(() => {
        this.updatingItems[itemId] = false;
      });
    }
  }

  removeItem(itemId: number) {
    this.cart = this.cart.filter(item => item.id !== itemId);
  }

  async processPayment(customerId: number, cartId: number) {
    await buy(customerId, cartId);
  }

  removeItemsFromCart() {
    this.cart = [];
    bookStore.cartCount = 0;
  }

  clearCart() {
    this.cart = [];
  }

  get totalAmount() {
    return this.cart.reduce((total, item) => total + (item.book.price * item.quantity), 0);
  }

  get totalItems() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  get isEmpty() {
    return this.cart.length === 0;
  }

  get reversedCart() {
    return [...this.cart].reverse();
  }
}

export const cartStore = new CartStore();