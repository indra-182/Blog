import type { Metadata } from 'next';
import Link from 'next/link';
import { Sidebar } from '@/components/blog/Sidebar';
import { getAllCategories, getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Tag',
  description: 'Jelajahi tulisan berdasarkan tag.',
  alternates: { canonical: '/tags' },
};

export default function TagsPage() {
  const tags = getAllTags();
  const categories = getAllCategories();

  return (
    <div className="page-frame">
      <header className="mb-8">
        <h1 className="section-title section-title--compact">Indeks tag</h1>
        <p className="mt-4 max-w-2xl text-lg text-(--text)">
          Tag membantu menyambungkan tulisan lintas kategori.
        </p>
      </header>
      <Sidebar categories={categories} tags={tags} />

      {tags.length === 0 ? (
        <p className="mt-10 text-lg text-(--text-weak)">
          Belum ada tag yang bisa dijelajahi.
        </p>
      ) : (
        <ul className="mt-10 flex flex-wrap gap-3">
          {tags.map((tag) => (
            <li key={tag.name}>
              <Link
                href={`/tags/${tag.name}`}
                className="neo-tag neo-tag--accent min-h-11 text-sm"
              >
                {tag.name} <span className="ms-2">{tag.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
