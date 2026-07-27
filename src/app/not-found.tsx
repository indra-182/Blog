import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Not Found',
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-32 text-center">
      <p className="magic-kicker">Lost in space</p>
      <h1 className="magic-heading magic-heading--gradient text-7xl sm:text-8xl">404</h1>
      <p className="text-2xl font-semibold tracking-[-0.04em] text-(--text-strong)">
        Page Not Found
      </p>
      <p className="text-lg text-(--text-weak)">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="magic-button magic-button--primary">
        &larr; Go Back Home
      </Link>
    </div>
  );
}
