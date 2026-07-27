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
      <h1 className="section-heading">Categories</h1>

      {categories.length === 0 && (
        <p className="text-lg text-(--text-weak)">No categories yet.</p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/category/${cat.name}`}
            className="magic-card magic-card--interactive p-5 group"
          >
            <h2 className="text-xl font-semibold tracking-tight text-(--text-strong) group-hover:text-(--accent)">
              {cat.name}
            </h2>
            <p className="mt-1 text-sm text-(--text-weak)">{cat.count} post(s)</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
