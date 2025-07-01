import { getOrder } from '../../../api/orders';
import Link from 'next/link';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await getOrder(Number(params.id));
  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-4">Order #{order.id}</h2>
      <div className="mb-2">Order Date: {order.orderDate}</div>
      <div className="mb-2">Status: {order.orderStatus}</div>
      <div className="mb-2">Total: ${order.totalPrice}</div>
      <div className="mb-2">Shipping Address: {order.shippingAddress}</div>
      <div className="mb-2">Payment Method: {order.paymentMethod}</div>
      <h3 className="text-xl font-semibold mt-6 mb-2">Items</h3>
      <ul className="list-disc pl-6">
        {order.orderItems?.map((item: any) => (
          <li key={item.id}>
            {item.book?.title} x {item.quantity} (${item.price})
          </li>
        ))}
      </ul>
      <Link href="/orders" className="text-blue-600 hover:underline mt-6 inline-block">Back to Orders</Link>
    </div>
  );
}
