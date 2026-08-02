'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Keep the route error boundary observable without exposing implementation details to readers.
    console.error(error);
  }, [error]);

  return (
    <div className="page-frame flex min-h-[60vh] items-center py-16">
      <section
        className="neo-panel max-w-2xl p-7 sm:p-10"
        role="alert"
        aria-labelledby="error-title"
      >
        <p className="meta-line text-(--danger)">Ada gangguan</p>
        <h1 id="error-title" className="mt-3 section-title section-title--compact">
          Halaman belum bisa dibuka
        </h1>
        <p className="mt-5 text-lg text-(--text)">
          Coba muat ulang. Kalau masalahnya berlanjut, kembali ke beranda untuk
          melanjutkan membaca.
        </p>
        <button type="button" className="neo-button mt-7" onClick={() => reset()}>
          Coba lagi
        </button>
      </section>
    </div>
  );
}
