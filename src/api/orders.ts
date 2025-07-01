export async function getOrders(customerId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order?customerId=${customerId}`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function getOrder(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order/${id}`);
  if (!res.ok) throw new Error('Failed to fetch order');
  return res.json();
}
// Add create, update, delete as needed
