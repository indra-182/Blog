import Link from 'next/link';
import type { Post } from '@/types/post';
import { formatDate } from '@/lib/utils';

export function NextReads({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="page-frame mt-16" aria-labelledby="next-reads-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <h2 id="next-reads-title" className="section-title section-title--compact">
          Lanjut baca
        </h2>
        <p className="max-w-sm text-sm text-(--text-weak)">
          Tulisan lain yang masih dekat dengan konteks ini.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.slug} className="neo-panel p-5">
            <div className="meta-line">
              {post.category} &middot; {formatDate(post.date)}
            </div>
            <h3 className="mt-3 text-xl font-black leading-tight text-(--text-strong)">
              <Link href={`/posts/${post.slug}`} className="hover:text-(--accent-strong)">
                {post.title}
              </Link>
            </h3>
            <p className="mt-2 line-clamp-3 text-sm text-(--text)">{post.excerpt}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
