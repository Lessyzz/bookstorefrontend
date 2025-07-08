'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getBookById } from '@/api/books';
import { updateCartItem } from '@/api/cart';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

const CUSTOMER_ID = 1;

export default function BookDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookId = Number(params?.id);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { t } = useTranslation('translation');
  const lang = typeof params.lang === 'string' ? params.lang : params.lang?.[0] ?? 'en';

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [params.lang]);

  useEffect(() => {
    if (!bookId) return;
    async function fetchBook() {
      try {
        const fetchedBook = await getBookById(bookId);
        setBook(fetchedBook);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [bookId]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await updateCartItem(CUSTOMER_ID, CUSTOMER_ID, bookId, quantity);
      router.push('/' + lang + '/cart');
    } catch (err) {
      alert('Error!');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    alert('Satın alma işlemi henüz uygulanmadı');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-2xl text-blue-500">{t('loading')}</span>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-red-500">Error!</span>
      </div>
    );
  }

  return (
    <div>
      <Navbar cartCount={0} />
      <div className="min-h-screen px-6 py-12 text-white font-sans mt-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
          <div className="w-full h-[500px] flex items-center justify-center bg-gray-800 rounded-xl overflow-hidden">
            <img
              src={book.photoUrl || '/placeholder_book.png'}
              alt={book.title}
              className="object-contain max-h-full w-full"
            />
          </div>
          <div className="h-[500px] flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{book.title}</h1>
              <p className="text-xl mb-6">{book.description || 'Açıklama bulunamadı.'}</p>
              <p className="text-lg text-gray-400 mb-2">
                <span className="font-semibold text-cyan-400">{t('publisher')}:</span> {book.publisher?.name}
              </p>
              <p className="text-lg text-gray-400 mb-2">
                <span className="font-semibold text-cyan-400">{t('author')}:</span> {book.author?.name}
              </p>
              <p className="text-lg text-gray-400 mb-2">
                <span className="font-semibold text-cyan-400">{t('genre')}:</span> {book.genre?.name}
              </p>
              <p className="text-lg text-gray-400 mb-4">
                <span className="font-semibold text-cyan-400">{t('page')}:</span> {book.pageCount}
              </p>
              <p className="text-3xl font-bold mb-4 text-white">${book.price.toFixed(2)}</p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                <label htmlFor="quantity" className="text-white">{t('quantity')}:</label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-20 px-2 py-1 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className={`w-full py-3 rounded-lg font-semibold text-white transition ${adding ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                  {adding ? 'Adding to cart...' : t('addToCart')}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
                >
                  {t('buy')}
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}