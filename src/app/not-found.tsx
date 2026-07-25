import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Not Found',
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-8">
      <h1 className="text-6xl sm:text-8xl font-black">404</h1>
      <p className="text-2xl font-bold uppercase">Halaman tidak ditemukan</p>
      <p className="text-lg font-medium">Halaman yang kamu cari tidak ada atau telah dipindahkan.</p>
      <Link href="/" className="neo-btn neo-btn--accent">
        &larr; Kembali ke Beranda
      </Link>
    </div>
  )
}
