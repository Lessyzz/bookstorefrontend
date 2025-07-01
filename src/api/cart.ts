export async function getCart(customerId: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shoppingcart/${customerId}`);
  if (!res.ok) throw new Error('Failed to fetch cart');

  const cart = await res.json();
  return cart;
}

export async function updateCartItem(customerId: number, cartId: number, bookId: number, quantity: number) {
  const update = { customerId, cartId, bookId, quantity };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shoppingcart/update-one`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  });

  if (!res.ok) throw new Error('Failed to update cart item');

  return res.json();
}