import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPostsByCategory, getAllCategories, getAllTags } from '@/lib/posts';
import { PostCard } from '@/components/blog/PostCard';
import { Sidebar } from '@/components/blog/Sidebar';

export async function generateStaticParams() {
  const cats = getAllCategories();
  return cats.map((c) => ({ slug: c.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Category: ${slug}`,
    description: `Posts in category ${slug}`,
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
    <div>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/" className="magic-button -ml-2">
          &larr; Back
        </Link>
        <h1 className="section-heading mb-0 flex-1">Category: {slug}</h1>
      </div>
      <p className="mb-6 text-sm text-(--text-weak)">{posts.length} post(s)</p>

      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <div className="divide-y divide-(--border)">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </div>

        <div className="sm:w-60 shrink-0">
          <Sidebar categories={categories} tags={tags} />
        </div>
      </div>
    </div>
  );
}
