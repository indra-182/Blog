import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/blog/PostCard';
import { Sidebar } from '@/components/blog/Sidebar';
import { getAllCategories, getAllTags, getPostsByCategory } from '@/lib/posts';

export function generateStaticParams() {
  return getAllCategories().map((category) => ({ slug: category.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Kategori: ${slug}`,
    description: `Tulisan dalam kategori ${slug}.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = getPostsByCategory(slug);
  if (posts.length === 0) notFound();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="page-frame">
      <header className="mb-8">
        <Link href="/categories" className="neo-button neo-button--quiet mb-5 ps-0">
          &larr; Semua kategori
        </Link>
        <h1 className="section-title section-title--compact">Kategori: {slug}</h1>
        <p className="mt-4 text-(--text-weak)">{posts.length} tulisan dalam topik ini.</p>
      </header>
      <Sidebar categories={categories} tags={tags} activeCategory={slug} />
      <section className="mt-8 max-w-4xl" aria-labelledby="category-posts-title">
        <h2 id="category-posts-title" className="sr-only">
          Tulisan dalam kategori {slug}
        </h2>
        <div>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
