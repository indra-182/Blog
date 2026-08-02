import type { Metadata } from 'next';
import Link from 'next/link';
import { Sidebar } from '@/components/blog/Sidebar';
import { getAllCategories, getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Kategori',
  description: 'Jelajahi tulisan berdasarkan kategori.',
  alternates: { canonical: '/categories' },
};

export default function CategoriesPage() {
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="page-frame">
      <header className="mb-8">
        <h1 className="section-title section-title--compact">Kategori tulisan</h1>
        <p className="mt-4 max-w-2xl text-lg text-(--text)">
          Mulai dari topik utama, lalu pilih tulisan yang paling dekat dengan pekerjaanmu.
        </p>
      </header>
      <Sidebar categories={categories} tags={tags} />

      {categories.length === 0 ? (
        <p className="mt-10 text-lg text-(--text-weak)">
          Belum ada kategori yang bisa dijelajahi.
        </p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href={`/category/${category.name}`}
                className="neo-panel block p-5 hover:bg-(--yellow) hover:text-[#1a1a1a]"
              >
                <h2 className="text-2xl font-black text-(--text-strong)">
                  {category.name}
                </h2>
                <p className="mt-2 text-sm text-(--text-weak)">
                  {category.count} tulisan
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
