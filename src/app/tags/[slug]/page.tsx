import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PostCard } from '@/components/blog/PostCard';
import { Sidebar } from '@/components/blog/Sidebar';
import { getAllCategories, getAllTags, getPostsByTag } from '@/lib/posts';

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ slug: tag.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Tag: ${slug}`,
    description: `Tulisan dengan tag ${slug}.`,
    alternates: { canonical: `/tags/${slug}` },
  };
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = getPostsByTag(slug);
  if (posts.length === 0) notFound();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="page-frame">
      <header className="mb-8">
        <Link href="/tags" className="neo-button neo-button--quiet mb-5 ps-0">
          &larr; Semua tag
        </Link>
        <h1 className="section-title section-title--compact">Tag: {slug}</h1>
        <p className="mt-4 text-(--text-weak)">{posts.length} tulisan memakai tag ini.</p>
      </header>
      <Sidebar categories={categories} tags={tags} activeTag={slug} />
      <section className="mt-8 max-w-4xl" aria-labelledby="tag-posts-title">
        <h2 id="tag-posts-title" className="sr-only">
          Tulisan dengan tag {slug}
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
