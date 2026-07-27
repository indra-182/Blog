import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllCategories } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Categories',
  description: 'All categories',
  alternates: { canonical: '/categories' },
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div>
      <p className="magic-kicker mb-3">Find your next read</p>
      <h1 className="magic-section-title">Categories</h1>

      {categories.length === 0 && (
        <p className="text-lg text-(--text-weak)">No categories yet.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/category/${cat.name}`}
            className="magic-card magic-card--interactive group"
          >
            <h2 className="text-2xl font-semibold tracking-[-0.045em] text-(--text-strong) group-hover:text-(--accent)">
              {cat.name}
            </h2>
            <p className="mt-2 text-sm text-(--text-weak)">{cat.count} post(s)</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
