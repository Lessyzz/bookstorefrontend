// Example: fetch all authors
export async function getAuthors() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/author`);
  if (!res.ok) throw new Error('Failed to fetch authors');
  return res.json();
}
// Add create, update, delete as needed

export async function getGenres() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/genre`);
  if (!res.ok) throw new Error('Failed to fetch genres');
  return res.json();
}

export async function getPublishers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/publisher`);
  if (!res.ok) throw new Error('Failed to fetch publishers');
  return res.json();
}

export async function getInventory() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/inventory`);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  return res.json();
}
