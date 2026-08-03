import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { EditorialHome } from '@/lib/editorial';
import type { Post } from '@/types/post';
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
          Artikel utama
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
  const visibleArticles = home.articles.slice(0, 6);
  const olderArticles = home.articles.slice(6);

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
          {olderArticles.length > 0 && (
            <details className="mt-4">
              <summary className="neo-button neo-button--secondary list-none">
                Tampilkan tulisan lama
              </summary>
              <div>
                {olderArticles.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </details>
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
