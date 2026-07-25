import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllCategories } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Categories',
  description: 'All categories',
  alternates: { canonical: '/categories' },
}

export default function CategoriesPage() {
  const categories = getAllCategories()

  return (
    <div>
      <h1 className="neo-section-title">Categories</h1>

      {categories.length === 0 && (
        <p className="text-lg font-bold">No categories yet.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => (
          <Link key={cat.name} href={`/category/${cat.name}`} className="neo-card group">
            <h2 className="text-2xl font-black uppercase group-hover:text-(--neo-accent-1) transition-colors">
              {cat.name}
            </h2>
            <p className="text-sm font-bold mt-2">{cat.count} post(s)</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
