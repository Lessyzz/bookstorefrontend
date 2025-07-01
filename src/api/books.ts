export async function getBooks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch books');
  return res.json();
}

export async function getBook(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/book/${id}`);
  if (!res.ok) throw new Error('Failed to fetch book');
  return res.json();
}
