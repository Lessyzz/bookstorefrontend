"use client";

import { observer } from 'mobx-react-lite';
import { adminStore } from '@/stores/AdminStore';
import i18n from '@/i18n';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AdminPage = observer(() => {
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [stockEdit, setStockEdit] = useState<{ [key: number]: number }>({});

  const { t } = useTranslation('translation');
  const params = useParams();
  const lang = typeof params.lang === 'string' ? params.lang : params.lang?.[0] ?? 'en';

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [params.lang]);

  useEffect(() => {
    adminStore.fetchBooks();
  }, []);

  const handleDelete = (bookId: number) => {
    setShowDeleteModal(bookId);
  };

  const confirmDelete = () => {
    if (showDeleteModal) {
      adminStore.deleteBook(showDeleteModal);
      setShowDeleteModal(null);
    }
  };

  const handleStockChange = (bookId: number, newStock: number) => {
    if (newStock >= 0) {
      adminStore.updateBookStock(bookId, newStock);
    }
  };

  const startEditingStock = (bookId: number, currentStock: number) => {
    setStockEdit({ ...stockEdit, [bookId]: currentStock });
  };

  const saveStockEdit = (bookId: number) => {
    const newStock = stockEdit[bookId];
    if (newStock !== undefined) {
      handleStockChange(bookId, newStock);
      const newStockEdit = { ...stockEdit };
      delete newStockEdit[bookId];
      setStockEdit(newStockEdit);
    }
  };

  const cancelStockEdit = (bookId: number) => {
    const newStockEdit = { ...stockEdit };
    delete newStockEdit[bookId];
    setStockEdit(newStockEdit);
  };

  if (adminStore.loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
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
            <p className="text-gray-600">Loading books...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-4 text-center text-white">{t('stockManagementSystem')}</h2>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-400">{adminStore.totalBooks}</div>
            <div className="text-sm text-gray-400">{t('totalBooks')}</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">{adminStore.totalStock}</div>
            <div className="text-sm text-gray-400">{t('totalStocks')}</div>
          </div>
          <div className="p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-red-600">{adminStore.lowStockBooks.length}</div>
            <div className="text-sm text-gray-400">{t('lowStockItems')}</div>
          </div>
        </div>

        {/* Error Display */}
        {adminStore.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex justify-between items-center">
              <span>{adminStore.error}</span>
              <button
                onClick={() => adminStore.clearError()}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg shadow-lg overflow-hidden">
        {adminStore.isEmpty ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto mb-6 w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-xl text-gray-600">No books found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="">
                <tr>
                  <th className="text-left py-3 px-4 font-bold text-white">#</th>
                  <th className="text-left py-3 px-4 font-bold text-white">{t('book')}</th>
                  <th className="text-left py-3 px-4 font-bold text-white">{t('publisher')}</th>
                  <th className="text-left py-3 px-4 font-bold text-white">{t('stock')}</th>
                  <th className="text-left py-3 px-4 font-bold text-white">{t('operation')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {adminStore.books.map((book, index) => (
                  <tr key={book.id}>
                    <td className="py-3 px-4 text-sm text-white">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{book.title}</div>
                      <div className="text-sm text-gray-500">${book.price}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-white">
                      {book.publisher?.name || '—'}
                    </td>
                    <td className="py-3 px-4">
                      {stockEdit[book.id] !== undefined ? (
                        <div className="flex items-center space-x-2 text-white">
                          <input
                            type="number"
                            value={stockEdit[book.id]}
                            onChange={(e) => setStockEdit({ 
                              ...stockEdit, 
                              [book.id]: parseInt(e.target.value) || 0 
                            })}
                            className="w-20 px-2 py-1 border rounded text-sm"
                            min="0"
                          />
                          <button
                            onClick={() => saveStockEdit(book.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => cancelStockEdit(book.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span 
                            className={`px-2 py-1 rounded text-sm font-bold ${adminStore.getStockColor(book.stockQuantity)}`}
                          >
                            {book.stockQuantity}
                          </span>
                          <button
                            onClick={() => startEditingStock(book.id, book.stockQuantity)}
                            className="text-cyan-500 hover:text-cyan-400 text-sm"
                          >
                            {t('edit')}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors">
                          {t('edit')}
                        </button>
                        <button 
                          onClick={() => handleDelete(book.id)}
                          disabled={adminStore.deletingBooks[book.id]}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            adminStore.deletingBooks[book.id]
                              ? 'cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600'
                          } text-white`}
                        >
                          {adminStore.deletingBooks[book.id] ? 'Deleting...' : t('delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-200 mb-6">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-200 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AdminPage;