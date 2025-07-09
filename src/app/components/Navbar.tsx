import { authStore } from '@/stores/AuthStore';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface NavbarProps {
    cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
    const params = useParams();
    const router = useRouter();
    const lang = typeof params.lang === 'string' ? params.lang : params.lang?.[0] ?? 'en';

    return ( // sticky
        <nav className="bg-inherit py-4 px-8 flex items-center justify-between top-0 z-50">
            <Link href={`/${lang}`} className="text-3xl font-extrabold text-white transition">
                BookStore
            </Link>
            <div className="flex items-center gap-8">
                <Link href={`/${lang}/orders`} className="text-white hover:text-white font-semibold transition">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-7 h-7"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5V6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 6v1.5M3 7.5h18M3 7.5v10.125A2.625 2.625 0 005.625 20.25h12.75A2.625 2.625 0 0021 17.625V7.5M7.5 11.25h9m-9 3h6" />
                    </svg>
                </Link>

                <Link href={`/${lang}/cart`} className="relative font-semibold transition text-white" aria-label="Sepet">
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

                <div className="flex items-center gap-8">
                    {authStore.isAuthenticated ? (
                        <>
                            <button
                                onClick={() => router.push(`/${lang}/profile`)}
                                className="flex items-center text-white font-semibold"
                                aria-label="Profile"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 mr-2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                                </svg>
                            </button>
                            {/* <button
                                onClick={() => { authStore.logout(); router.push(`/${lang}`) }}
                                className="text-white hover:text-red-500 font-semibold transition"
                            >
                                Logout
                            </button> */}
                        </>
                    ) : (
                        <Link href={`/${lang}/login`} className="text-white hover:text-blue-500 font-semibold transition">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;