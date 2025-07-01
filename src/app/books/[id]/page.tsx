import { getBook } from '../../../api/books';
import Link from 'next/link';

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBook(Number(params.id));
  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-4">{book.title}</h2>
      <p className="mb-2">Author: {book.author?.name}</p>
      <p className="mb-2">Genre: {book.genre?.name}</p>
      <p className="mb-2">Publisher: {book.publisher?.name}</p>
      <p className="mb-2">ISBN: {book.isbn}</p>
      <p className="mb-2">Format: {book.format}</p>
      <p className="mb-2">Publication Date: {book.publicationDate}</p>
      <p className="mb-2 font-semibold">Price: ${book.price}</p>
      <Link href="/" className="text-blue-600 hover:underline">Back to Books</Link>
    </div>
  );
}
