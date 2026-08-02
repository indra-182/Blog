'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import type { EditorialHome } from '@/lib/editorial';
import type { Post } from '@/types/post';
import { CurationCard } from './CurationCard';
import { PostCard } from './PostCard';

interface LatestPostsClientProps {
  home: EditorialHome;
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
}

function LeadBlock({ post }: { post: Post }) {
  return (
    <section
      className="neo-panel neo-panel--yellow p-5 sm:p-8"
      aria-labelledby="lead-title"
    >
      <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#1a1a1a]">
        <span className="border-2 border-[#1a1a1a] bg-[#fffdf7] px-2 py-1 font-mono text-xs uppercase">
          {post.type === 'article' ? 'Artikel utama' : 'Kurasi terbaru'}
        </span>
        <span>{post.category}</span>
        <span aria-hidden="true">&middot;</span>
        <span>{formatDate(post.date)}</span>
      </div>
      <h1
        id="lead-title"
        className="mt-5 max-w-4xl text-[clamp(2.6rem,8vw,6.5rem)] font-black leading-[0.94] tracking-[-0.04em] text-[#1a1a1a]"
      >
        {post.title}
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#1a1a1a]">
        {post.excerpt}
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Link
          href={`/posts/${post.slug}`}
          className="neo-button border-[#1a1a1a] bg-[#ff6b35]"
        >
          Baca tulisan &rarr;
        </Link>
        <span className="text-sm font-bold text-[#1a1a1a]">
          {post.readingTimeMinutes} menit baca
        </span>
      </div>
    </section>
  );
}

export function LatestPostsClient({ home, categories, tags }: LatestPostsClientProps) {
  const [articleLimit, setArticleLimit] = useState(6);
  const [curationLimit, setCurationLimit] = useState(4);
  const visibleArticles = home.articles.slice(0, articleLimit);
  const visibleCurations = home.curations.slice(0, curationLimit);

  if (!home.lead) {
    return (
      <div className="page-frame">
        <section className="neo-panel p-8 sm:p-12" aria-labelledby="empty-home-title">
          <h1 id="empty-home-title" className="section-title section-title--compact">
            Belum ada tulisan
          </h1>
          <p className="mt-5 max-w-xl text-lg text-(--text)">
            Ruang ini sedang disiapkan. Coba kembali lagi nanti.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-frame">
      <LeadBlock post={home.lead} />

      <nav className="mt-10" aria-label="Jelajahi kategori">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-black text-(--text-strong)">Pilih jalur topik</h2>
          <Link
            href="/categories"
            className="text-sm font-bold text-(--blue) underline underline-offset-4"
          >
            Semua kategori
          </Link>
        </div>
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <li key={category.name}>
              <Link href={`/category/${category.name}`} className="browse-rail__link">
                {category.name}{' '}
                <span className="ms-2 text-xs opacity-70">{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {home.articles.length > 0 && (
        <section className="mt-14 max-w-4xl" aria-labelledby="article-list-title">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3 border-b-3 border-(--border) pb-3">
            <h2 id="article-list-title" className="section-title section-title--compact">
              Tulisan terbaru
            </h2>
            <p className="text-sm text-(--text-weak)">
              {home.articles.length} tulisan selain artikel utama
            </p>
          </div>
          <div>
            {visibleArticles.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
          {articleLimit < home.articles.length && (
            <button
              type="button"
              className="neo-button neo-button--secondary mt-4"
              onClick={() => setArticleLimit((limit) => limit + 6)}
            >
              Tampilkan tulisan lama
            </button>
          )}
        </section>
      )}

      {home.curations.length > 0 && (
        <section className="mt-16 max-w-4xl" aria-labelledby="curation-list-title">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b-3 border-(--border) pb-3">
            <div>
              <h2
                id="curation-list-title"
                className="section-title section-title--compact"
              >
                Kurasi pilihan
              </h2>
              <p className="mt-3 text-(--text-weak)">
                Link dan catatan singkat untuk menjaga radar tetap menyala.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {visibleCurations.map((post) => (
              <article key={post.slug} className="neo-panel p-5">
                <div className="meta-line">
                  {post.category} &middot; {formatDate(post.date)}
                </div>
                <h3 className="mt-3 text-2xl font-black leading-tight text-(--text-strong)">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="hover:text-(--accent-strong)"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-(--text)">{post.excerpt}</p>
                <div className="mt-4">
                  <CurationCard items={post.items} compact />
                </div>
                <Link
                  href={`/posts/${post.slug}`}
                  className="mt-4 inline-flex text-sm font-black text-(--blue) underline underline-offset-4 hover:text-(--accent-strong)"
                >
                  Lihat kurasi lengkap &rarr;
                </Link>
              </article>
            ))}
          </div>
          {curationLimit < home.curations.length && (
            <button
              type="button"
              className="neo-button neo-button--secondary mt-4"
              onClick={() => setCurationLimit((limit) => limit + 4)}
            >
              Tampilkan kurasi lama
            </button>
          )}
        </section>
      )}

      <div className="mt-12 border-t-2 border-(--border-muted) pt-4">
        <Link
          href="/tags"
          className="text-sm font-bold text-(--text-weak) underline underline-offset-4 hover:text-(--accent-strong)"
        >
          Jelajahi indeks tag &rarr;
        </Link>
        <span className="ms-3 text-sm text-(--text-weak)">
          {tags.length} tag tersedia
        </span>
      </div>
    </div>
  );
}
