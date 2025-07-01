'use client';
import Link from 'next/link';
import { getBooks } from '../api/books';
import { updateCartItem } from '../api/cart';
import { useState, useEffect } from 'react';

const FORMATS = ['Hardcover', 'Paperback', 'eBook', 'Audiobook'];
const CUSTOMER_ID = 101; // Burası gerçek kullanıcıya göre dinamik yapılabilir

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      const res = await getBooks();
      setBooks(res);
      setFilteredBooks(res);
      setLoading(false);
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    if (!selectedFormat) {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter((b: any) => b.format === selectedFormat));
    }
  }, [selectedFormat, books]);

  const handleFormatFilter = (format: string) => {
    setSelectedFormat(format === selectedFormat ? '' : format);
  };

  const handleAddToCart = async (bookId: number) => {
    try {
      await updateCartItem(CUSTOMER_ID, 101, bookId, 1);
    } 
    catch (e) {
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-700">BookStore</Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-blue-600 font-medium">Books</Link>
          <Link href="/cart" className="relative hover:text-blue-600 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0A48.108 48.108 0 0116.5 6.75c2.485 0 4.5 2.015 4.5 4.5s-2.015 4.5-4.5 4.5a48.108 48.108 0 01-11.394-1.478l-.383-1.437m0 0A1.125 1.125 0 013.636 12H2.25m1.386 0l.383 1.437m0 0A1.125 1.125 0 004.5 15.75h15a1.125 1.125 0 001.125-1.125V6.75A1.125 1.125 0 0019.5 5.625h-15A1.125 1.125 0 003.375 6.75v5.25z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5">0</span>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-100 to-blue-300 py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-4">Discover Your Next Favorite Book</h1>
        <p className="text-lg md:text-xl text-blue-900 mb-6">Browse our curated collection and shop the best books online!</p>
      </section>

      {/* Main Content Grid */}
      <main className="flex-1 container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Kategoriler</h3>
              <div className="space-y-3">
                {/* All Books Option */}
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="format"
                    value=""
                    checked={selectedFormat === ''}
                    onChange={() => setSelectedFormat('')}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-gray-700 group-hover:text-blue-600 font-medium">
                    Tüm Kitaplar
                  </span>
                </label>
                
                {/* Format Options */}
                {FORMATS.map((format) => (
                  <label key={format} className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="format"
                      value={format}
                      checked={selectedFormat === format}
                      onChange={() => setSelectedFormat(format)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-blue-600 font-medium">
                      {format}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Books */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              {selectedFormat ? `${selectedFormat} Kitaplar` : 'Tüm Kitaplar'}
            </h2>
            
            {loading ? (
              <div className="text-center text-gray-500 py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2">Kitaplar yükleniyor...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p>Seçilen kategoride kitap bulunamadı.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBooks.map((book: any) => (
                  <div key={book.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col hover:shadow-2xl transition">
                    <div className="h-48 w-full flex items-center justify-center mb-4 bg-gray-100 rounded">
                      {/* Placeholder image, replace with book.image if available */}
                      <img src="/window.svg" alt={book.title} className="h-32 object-contain" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1 text-gray-900 line-clamp-2">{book.title}</h3>
                    <p className="mb-1 text-gray-700 text-sm">Yazar: <span className="font-medium">{book.author?.name}</span></p>
                    <p className="mb-1 text-gray-700 text-sm">Tür: {book.genre?.name}</p>
                    <p className="mb-1 text-gray-700 text-sm">Format: {book.format}</p>
                    <p className="mb-2 text-blue-700 font-bold text-lg">${book.price}</p>
                    <div className="mt-auto flex gap-2">
                      <Link href={`/books/${book.id}`} className="flex-1 bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700 text-center text-sm font-medium transition">
                        Detayları Gör
                      </Link>
                      <button
                        className="flex-1 bg-green-500 text-white py-1.5 rounded hover:bg-green-600 text-sm font-medium transition disabled:opacity-60"
                        onClick={() => handleAddToCart(book.id)}
                        disabled={addingToCart[book.id]}
                      >
                        {addingToCart[book.id] ? 'Ekleniyor...' : 'Sepete Ekle'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 py-8 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-700 text-sm">© {new Date().getFullYear()} BookStore. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition" aria-label="Twitter">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M24 4.557a9.93 9.93 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.564-2.005.974-3.127 1.195a4.92 4.92 0 00-8.384 4.482C7.691 8.095 4.066 6.13 1.64 3.161c-.542.929-.856 2.01-.857 3.17 0 2.188 1.115 4.116 2.823 5.247a4.904 4.904 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 01-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 010 21.543a13.94 13.94 0 007.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A10.012 10.012 0 0024 4.557z" /></svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition" aria-label="Instagram">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.337 2.396 3.51 2.338 4.788 2.279 6.068 2.266 6.477 2.266 12c0 5.523.013 5.932.072 7.212.058 1.278.33 2.451 1.297 3.418.967.967 2.14 1.239 3.418 1.297C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.278-.058 2.451-.33 3.418-1.297.967-.967 1.239-2.14 1.297-3.418.059-1.28.072-1.689.072-7.212 0-5.523-.013-5.932-.072-7.212-.058-1.278-.33-2.451-1.297-3.418C19.399.402 18.226.13 16.948.072 15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" /></svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition" aria-label="Facebook">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24H12.82v-9.294H9.692v-3.622h3.127V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
