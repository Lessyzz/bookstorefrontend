'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { bookStore } from '@/stores/BookStore';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import { useParams } from 'next/navigation';

const GENRE_MAP_TR: { [id: number]: string } = {
  1: 'Macera',
  2: 'Polisiye',
  3: 'Fantastik',
  4: 'Bilim Kurgu',
  5: 'Romantik',
  6: 'Gerilim',
  7: 'Korku',
  8: 'Dram',
  9: 'Gizem'
};

const GENRE_MAP_EN: { [id: number]: string } = {
  1: 'Adventure',
  2: 'Mystery',
  3: 'Fantasy',
  4: 'Science Fiction',
  5: 'Romance',
  6: 'Thriller',
  7: 'Horror',
  8: 'Drama',
  9: 'Suspense'
};

const CUSTOMER_ID = 1;

const Page = observer(() => {
  const { t } = useTranslation('translation');
  const params = useParams();
  const lang = typeof params.lang === 'string' ? params.lang : params.lang?.[0] ?? 'en';

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [params.lang]);

  useEffect(() => {
    bookStore.fetchBooks();
  }, []);

  const handleAddToCart = (bookId: number) => {
    bookStore.addToCart(bookId, CUSTOMER_ID);
  };

  const handleGenreFilter = (genreId: number | null) => {
    bookStore.filterByGenre(genreId);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar cartCount={bookStore.cartCount}></Navbar>

      {/* Hero */}
      <section className=" py-16 px-6 text-center">
        <h1 className="text-5xl font-extrabold text-cyan-500 mb-4 leading-tight">
          {t('discover1')}<span className="text-cyan-600"> {t('discover2')}</span>
        </h1>
        <p className="text-xl text-cyan-600 max-w-3xl mx-auto">
          {t('browseText')}
        </p>
      </section>

      <main className="flex-1 container mx-auto py-12 px-4 md:px-8">
        {/* Filters */}
        <div className="bg-inherit rounded-xl shadow-md p-6 mb-10">
          <h3 className="text-3xl font-bold mb-4 text-cyan-500 text-center">{t('categories')}</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => handleGenreFilter(null)}
              className={`font-semibold text-lg px-4 py-2 rounded-full border ${
                bookStore.selectedGenreId === null
                  ? 'text-white border-blue-500'
                  : 'text-white border-gray-300 hover:border-blue-400'
              } transition`}
            >
              {t('allBooks')}
            </button>
            {Object.entries(lang === 'en' ? GENRE_MAP_EN : GENRE_MAP_TR).map(([id, name]) => (
              <button
                key={id}
                onClick={() => handleGenreFilter(Number(id))}
                className={`text-lg px-4 py-2 rounded-full border ${
                  bookStore.selectedGenreId === Number(id)
                    ? 'text-white border-blue-500 font-bold'
                    : 'text-white hover:border-blue-400'
                } transition`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <section className="bg-inherit rounded-xl p-6 shadow-inner">
          {bookStore.loading ? (
            <div className="flex justify-center items-center space-x-2 py-20">
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
          ) : !bookStore.hasFilteredBooks ? (
            <div className="text-center text-gray-500 py-20">
              <svg
                className="mx-auto mb-6 w-16 h-16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 6v6l4 2" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              <p className="text-xl font-semibold text-white">{t('notFoundBooksSelectedCategory')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {bookStore.filteredBooks.map((book) => (
                <article
                  key={book.id}
                  className="rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition"
                >
                  <div className="h-64 flex items-center justify-center overflow-hidden">
                    <img
                      src={book.photoUrl || '/placeholder_book.png'}
                      alt={book.title}
                      className="object-contain max-h-full w-full transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-white">{book.title}</h3>
                    <p className="text-gray-700 mb-1 text-sm">
                      <span className="font-semibold text-cyan-500">{t('publisher')}:</span> <span className='text-white'>{book.publisher?.name}</span>
                    </p>
                    <p className="text-gray-700 mb-1 text-sm">
                      <span className="font-semibold text-cyan-500">{t('author')}:</span> <span className='text-white'>{book.author?.name}</span>
                    </p>
                    <p className="text-gray-700 mb-1 text-sm">
                      <span className="font-semibold text-cyan-500">{t('genre')}:</span> <span className='text-white'>{book.genre?.id ? (lang === 'en' ? GENRE_MAP_EN[book.genre.id] : GENRE_MAP_TR[book.genre.id]) : book.genre?.name}</span>
                    </p>
                    <p className="text-gray-700 mb-3 text-sm">
                      <span className="font-semibold text-cyan-500">{t('page')}:</span> <span className='text-white'>{book.pageCount}</span>
                    </p>
                    <p className="text-white font-bold text-2xl">${book.price.toFixed(2)}</p>
                    <div className="mt-auto flex gap-3 pt-4">
                      <Link
                        href={`/${lang}/books/${book.id}`}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-center font-semibold transition"
                      >
                        {t('details')}
                      </Link>
                      <button
                        disabled={bookStore.addingToCart[book.id]}
                        onClick={() => handleAddToCart(book.id)}
                        className={`flex-1 py-2 rounded-lg font-semibold text-white transition ${
                          bookStore.addingToCart[book.id]
                            ? 'bg-green-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                        }`}
                      >
                        {bookStore.addingToCart[book.id] ? t('adding') : t('addToCart')}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
});

export default Page;