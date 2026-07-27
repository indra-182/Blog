import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Not Found',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
      <h1 className="text-7xl sm:text-8xl font-semibold tracking-tight text-(--text-strong)">
        404
      </h1>
      <p className="text-xl text-(--text-weak)">Page not found.</p>
      <Link href="/" className="magic-button magic-button--primary mt-4">
        &larr; Go Back Home
      </Link>
    </div>
  );
}
