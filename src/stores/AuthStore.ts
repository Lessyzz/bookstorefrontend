import { apiLogin, validateToken } from '@/api/login';
import { makeAutoObservable } from 'mobx';

export class AuthStore {
    isAuthenticated = false;
    userLoginDto: { email: string; password: string } | null = null;
    user: { id: number; name: string; type: number; address: string; phone: string; email: string; website: string; membershipLevel: number; photoUrl: string; token: string;  } | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async initialize() {
        const validation = await validateToken(localStorage.getItem('token') || '');
        if (validation) {
            // BACKENDDEN KULLANICI BİLGİLERİNİ AL DİREKT VALİDATE FONKSİYONUNDA GÖNDER
        }
    }

    async login(userLoginDto: { email: string; password: string }) {
        const user = await apiLogin(userLoginDto.email, userLoginDto.password);
        if (user === null) {
            this.isAuthenticated = false;
            this.user = null;
            return;
        }
        this.user = user;
        this.isAuthenticated = true;
        localStorage.setItem('token', user.token);
    }

    logout() {
        this.isAuthenticated = false;
        this.user = null;
        localStorage.removeItem('token');
    }
}

export const authStore = new AuthStore();
authStore.initialize();