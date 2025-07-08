import Link from 'next/link';
import { useParams } from 'next/navigation';

interface NavbarProps {
    cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
    const params = useParams();
    const lang = typeof params.lang === 'string' ? params.lang : params.lang?.[0] ?? 'en';

    return (
        <nav className="bg-inherit shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-50">
            <Link href={`/${lang}`} className="text-3xl font-extrabold text-white transition">
                BookStore
            </Link>
            <div className="flex items-center gap-8">
                {/* <Link href="/" className="hover:text-blue-600 font-semibold transition">Kitaplar</Link> */}
                <Link href={`/${lang}/cart`} className="relative font-semibold transition" aria-label="Sepet">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-7 h-7"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437m0 0A48.108 48.108 0 0116.5 6.75c2.485 0 4.5 2.015 4.5 4.5s-2.015 4.5-4.5 4.5a48.108 48.108 0 01-11.394-1.478l-.383-1.437m0 0A1.125 1.125 0 013.636 12H2.25m1.386 0l.383 1.437m0 0A1.125 1.125 0 004.5 15.75h15a1.125 1.125 0 001.125-1.125V6.75A1.125 1.125 0 0019.5 5.625h-15A1.125 1.125 0 003.375 6.75v5.25z" />
                    </svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 font-semibold shadow-lg">
                            {cartCount}
                        </span>
                    )}
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;