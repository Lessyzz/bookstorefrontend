'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authStore } from '@/stores/AuthStore';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { t } = useTranslation('translation');
    const params = useParams();
    const lang = typeof params.lang === 'string' ? params.lang : params.lang?.[0] ?? 'en';

    const handleLogin = async () => {
        await authStore.login({ email, password });
        if (authStore.isAuthenticated) {
            router.push(`/${lang}`);
        }
        else {
            alert('Giriş başarısız. Lütfen e-posta ve şifrenizi kontrol edin.');
        }
    };

    return (
        <div>
            <Navbar cartCount={0} />
            <div className="container mx-auto py-10 px-4 max-w-md">
                <h1 className="text-3xl font-bold text-white mb-6">Giriş Yap</h1>
                <input
                    type="email"
                    placeholder="E-posta adresi"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white border border-gray-600"
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white border border-gray-600"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Giriş Yap
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default LoginPage;