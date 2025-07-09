'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/AuthStore';
import { useTranslation } from 'react-i18next';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

const inputClass =
    'block w-full px-3 py-2 border border-white rounded-md focus:outline-none focus:ring focus:ring-blue-200 mb-2';
const labelClass = 'block mb-2 font-medium text-white';
const formGroupClass = 'mb-4';
const formClass =
    'max-w-md mx-auto p-8 rounded-lg shadow-md mt-8 shadow-white';
const buttonClass =
    'w-full py-2 px-4 text-white font-semibold rounded border border-white';

const ProfilePage = observer(() => {
    const router = useRouter();
    const { t } = useTranslation('translation');
    const params = useParams();
    const lang = typeof params.lang === 'string' ? params.lang : params.lang?.[0] ?? 'en';

    type PublisherFormData = {
        name: string;
        address: string;
        phone: string;
        email: string;
        password: string;
        website: string;
    };

    type CustomerFormData = {
        name: string;
        email: string;
        password: string;
        phone: string;
        address: string;
        membershipLevel: number;
        photoUrl: string;
    };

    type FormData = Partial<PublisherFormData & CustomerFormData>;

    const [formData, setFormData] = useState<FormData>({});

    useEffect(() => {
        if (!authStore.isAuthenticated) {
            router.push(`/${lang}/login`);
        } else {
            if (authStore.user?.type === 1) {
                setFormData({
                    name: authStore.user.name || '',
                    address: authStore.user.address || '',
                    phone: authStore.user.phone || '',
                    email: authStore.user.email || '',
                    password: '',
                    website: authStore.user.website || '',
                });
            } else if (authStore.user?.type === 2) {
                setFormData({
                    name: authStore.user.name || '',
                    email: authStore.user.email || '',
                    password: '',
                    phone: authStore.user.phone || '',
                    address: authStore.user.address || '',
                    membershipLevel: authStore.user.membershipLevel || 1,
                    photoUrl: authStore.user.photoUrl || '',
                });
            }
        }
        // eslint-disable-next-line
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'membershipLevel' ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Submit the form data to the server
        console.log('Form submitted:', formData);
    };

    if (!authStore.isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen">
            <Navbar cartCount={0} />
            <h1 className="text-5xl font-bold text-center mt-8 mb-4 text-white">{t('profileTitle')}</h1>
            <form onSubmit={handleSubmit} className={formClass}>
                {authStore.user?.type === 1 && (
                    <>
                        <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('name')}
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                        <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('address')}
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                        <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('phone')}
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                        <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('email')}
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                        {/* <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('profile.publisher.password')}
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div> */}
                        <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('website')}
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                    </>
                )}
                {authStore.user?.type === 2 && (
                    <>
                        <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('name')}
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                        <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('email')}
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                        {/* <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('profile.customer.password')}
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div> */}
                        <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('phone')}
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                        <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('address')}
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                        {/* <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('profile.customer.membershipLevel')}
                                <select
                                    name="membershipLevel"
                                    value={formData.membershipLevel}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                >
                                    <option value={1}>{t('profile.customer.membershipLevel.silver')}</option>
                                    <option value={2}>{t('profile.customer.membershipLevel.gold')}</option>
                                    <option value={3}>{t('profile.customer.membershipLevel.platinum')}</option>
                                </select>
                            </label>
                        </div> */}
                        <div className={formGroupClass}>
                            <label className={labelClass}>
                                {t('photoUrl')}
                                <input
                                    type="text"
                                    name="photoUrl"
                                    value={formData.photoUrl}
                                    onChange={handleInputChange}
                                    className={inputClass}
                                />
                            </label>
                        </div>
                    </>
                )}
                <button type="submit" className={buttonClass}>
                    {t('save')}
                </button>
                {/* logout */}
                <button
                    type="button"
                    onClick={() => {
                        authStore.logout();
                        router.push(`/${lang}`);
                    }}
                    className={`${buttonClass} mt-2`}
                >
                    {t('logout')}
                </button>
            </form>
            <Footer />
        </div>
    );
});

export default ProfilePage;