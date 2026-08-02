import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Halaman tidak ditemukan',
};

export default function NotFound() {
  return (
    <div className="page-frame flex min-h-[60vh] items-center py-16">
      <section
        className="neo-panel max-w-2xl p-7 sm:p-10"
        aria-labelledby="not-found-title"
      >
        <p className="meta-line text-(--accent-strong)">404</p>
        <h1 id="not-found-title" className="mt-3 section-title section-title--compact">
          Halaman ini tidak ditemukan
        </h1>
        <p className="mt-5 text-lg text-(--text)">
          Mungkin tautannya sudah berubah, atau tulisan yang kamu cari belum diterbitkan.
        </p>
        <Link href="/" className="neo-button mt-7">
          Kembali ke beranda &rarr;
        </Link>
      </section>
    </div>
  );
}
