import Link from 'next/link';
import { getOrders } from '../../api/orders';

export default async function OrdersPage() {
  // For demo, using customerId=1. In real app, get from auth/session
  const customerId = 1;
  const orders = await getOrders(customerId);
  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order: any) => (
            <li key={order.id} className="bg-white rounded shadow p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-semibold">Order #{order.id}</span> - {order.orderDate}
                </div>
                <Link href={`/orders/${order.id}`} className="text-blue-600 hover:underline">View Details</Link>
              </div>
              <div>Status: {order.orderStatus}</div>
              <div>Total: ${order.totalPrice}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
