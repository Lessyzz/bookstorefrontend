'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { orderStore } from '@/stores/OrderStore';

const CUSTOMER_ID = 1;

const Page = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation('translation');
  const params = useParams();
  const lang = typeof params.lang === 'string' ? params.lang : params.lang?.[0] ?? 'en';

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [params.lang]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      await orderStore.fetchOrders(CUSTOMER_ID);
      setOrders(orderStore.orders);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
    setLoading(false);
  };

  const orderStatusText = (status: number) => {
    const statusMap = {
      0: t('pending'),
      1: t('shipped'),
      2: t('delivered'),
      3: t('cancelled'),
    };
    return statusMap[status as keyof typeof statusMap] || 'Unknown';
  };

  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  const toggleDetails = async (orderId: number) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null); // kapat
    } else {
      await orderStore.fetchOrderItems(orderId);
      setExpandedOrderId(orderId);
    }
  };


  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar cartCount={0} />

      <section className="py-16 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-cyan-500 mb-4">{t('yourOrders')}</h1>
      </section>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-8">
        {loading ? (
          <div className="flex justify-center items-center space-x-2 py-20">
            <svg
              className="animate-spin h-10 w-10 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center text-white text-xl py-10">
            {t('noOrders')}
          </div>
        ) : (
            <div className="grid grid-cols-1 gap-6">
            {[...orders]
              .slice()
              .sort((a, b) => b.id - a.id)
              .map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-cyan-700 bg-opacity-20 p-6 shadow-lg text-white"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold">#{order.id}</h2>
                  <p className="text-sm text-cyan-400">
                  {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p className="mt-1">
                  {t('shippingAddress')}: <span className="text-white">{order.shippingAddress}</span>
                  </p>
                  <p className="mt-1">
                  {t('status')}: <span className="font-bold">{orderStatusText(order.orderStatus)}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-400">
                  ${order.totalPrice?.toFixed(2)}
                  </p>
                  <button
                  onClick={() => toggleDetails(order.id)}
                  className="inline-block mt-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition font-semibold text-white"
                  >
                  {expandedOrderId === order.id ? t('hideDetails') : t('viewDetails')}
                  </button>
                </div>
                </div>

                {/* Açılır Panel */}
                {expandedOrderId === order.id && (
                <div className="mt-4 border-t border-cyan-700 pt-4">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">{t('items')}:</h3>
                  <ul className="list-disc pl-5">
                  {(orderStore.orderItemsMap[order.id] || []).map((item: any) => (
                    <li key={item.id} className="text-sm">
                    {item.book?.title ?? 'Unknown Book'} — {item.quantity} × ${item.book?.price?.toFixed(2) ?? '0.00'}
                    </li>
                  ))}
                  </ul>
                </div>
                )}
              </div>
              ))}
            </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Page;
