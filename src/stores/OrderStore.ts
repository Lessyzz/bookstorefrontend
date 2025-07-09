import { getOrderItems, getOrdersById } from '@/api/orders';
import { makeAutoObservable, runInAction } from 'mobx';

export interface OrderItem {
    id: number;
    book: {
        id: number;
        title: string;
        price: number;
    };
    quantity: number;
    price: number;
    discount: number;
}

export interface Order {
    id: number;
    orderDate: string;
    customer: {
        id: number;
        name: string;
    };
    totalPrice: number;
    orderStatus: number;
    shippingAddress: string;
    paymentMethod: number;
    orderItems: OrderItem[];
}

class OrderStore {
    orders: Order[] = [];
    loading: boolean = false;

    orderItemsMap: { [orderId: number]: any[] } = {};

    constructor() {
        makeAutoObservable(this);
    }

    async fetchOrders(customerId: number) {
        this.loading = true;
        try {
            const data = await getOrdersById(customerId);
            runInAction(() => {
                this.orders = data;
                this.loading = false;
            });
        } catch (error) {
            console.error('Siparişler alınırken hata oluştu:', error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    async fetchOrderItems(orderId: number) {
        if (this.orderItemsMap[orderId]) return;

        const data = await getOrderItems(orderId);
        runInAction(() => {
            this.orderItemsMap[orderId] = data;
        });
    }
}

export const orderStore = new OrderStore();
