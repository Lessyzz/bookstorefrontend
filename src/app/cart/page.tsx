'use client';

import { useEffect, useState } from 'react';
import { getCart } from '../../api/cart';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await getCart(101);
        setCart(data);
        console.log(data);
      } catch (error) {
        console.error('Sepet verisi alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return <p className="p-4">Yükleniyor...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr>
              <th className="py-2 px-4">Book</th>
              <th className="py-2 px-4">Quantity</th>
              <th className="py-2 px-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4">{item.book?.title}</td>
                <td className="py-2 px-4">{item.quantity}</td>
                <td className="py-2 px-4">${item.book?.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
