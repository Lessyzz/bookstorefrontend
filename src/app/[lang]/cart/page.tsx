'use client';

import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { cartStore } from '@/stores/CartStore';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import i18n from '@/i18n';

const CUSTOMER_ID = 1;

const CartPage = observer(() => {
  const { t } = useTranslation('translation');
  const params = useParams();
  const lang = typeof params.lang === 'string' ? params.lang : params.lang?.[0] ?? 'en';

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [params.lang]);

  useEffect(() => {
    cartStore.fetchCart(CUSTOMER_ID);
  }, []);

  const handleIncreaseQuantity = (itemId: number) => {
    cartStore.increaseQuantity(itemId, CUSTOMER_ID);
  };

  const handleDecreaseQuantity = (itemId: number) => {
    cartStore.decreaseQuantity(itemId, CUSTOMER_ID);
  };

  const handlePayment = () => {
    cartStore.processPayment();
  };

  if (cartStore.loading) {
    return (
      <div>
        <Navbar cartCount={cartStore.totalItems} />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center py-20">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar cartCount={cartStore.totalItems} />
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-6">{t('cart')}</h2>
        
        {cartStore.isEmpty ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto mb-6 w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p className="text-xl text-gray-500">{t('emptyCart')}</p>
          </div>
        ) : (
          <>
            <div className="rounded-xl shadow-lg overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-bold text-white">{t('book')}</th>
                    <th className="py-4 px-6 text-center text-sm font-bold text-white">{t('quantity')}</th>
                    <th className="py-4 px-6 text-right text-sm font-bold text-white">{t('price')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cartStore.reversedCart.map((item) => (
                    <tr key={item.id}>
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-white">{item.book?.title}</div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDecreaseQuantity(item.id)}
                            disabled={cartStore.updatingItems[item.id]}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                              cartStore.updatingItems[item.id]
                                ? 'bg-gray-100 border-gray-300 text-white cursor-not-allowed'
                                : 'border-gray-300 text-white hover:border-gray-400'
                            }`}
                          >
                            {cartStore.updatingItems[item.id] ? '...' : '-'}
                          </button>
                          <span className="mx-3 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQuantity(item.id)}
                            disabled={cartStore.updatingItems[item.id]}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                              cartStore.updatingItems[item.id]
                                ? 'bg-gray-100 border-gray-300 text-white cursor-not-allowed'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            {cartStore.updatingItems[item.id] ? '...' : '+'}
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="text-sm font-medium text-white">
                          ${(item.book?.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs text-white">
                          (${item.book?.price} {t('each')})
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 rounded-xl p-6">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-white">
                  {t('total')}: ${cartStore.totalAmount.toFixed(2)}
                </div>
                <button
                  onClick={handlePayment}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl"
                >
                  {t('completePayment')}
                </button>
              </div>
              <div className="mt-2 text-sm text-gray-200">
                {cartStore.totalItems} {cartStore.totalItems === 1 ? t('item') : t('items')}
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
});

export default CartPage;