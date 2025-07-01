import { getAuthors, getGenres, getPublishers, getInventory } from '../../api/admin';

export default async function AdminPage() {
  const [authors, genres, publishers, inventory] = await Promise.all([
    getAuthors(),
    getGenres(),
    getPublishers(),
    getInventory(),
  ]);
  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h3 className="text-xl font-semibold mb-2">Authors</h3>
          <ul className="list-disc pl-6">
            {authors.map((a: any) => (
              <li key={a.id}>{a.name}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Genres</h3>
          <ul className="list-disc pl-6">
            {genres.map((g: any) => (
              <li key={g.id}>{g.name}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Publishers</h3>
          <ul className="list-disc pl-6">
            {publishers.map((p: any) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Inventory</h3>
          <ul className="list-disc pl-6">
            {inventory.map((inv: any) => (
              <li key={inv.id}>{inv.book?.title} ({inv.format}) - Stock: {inv.stockCount}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
