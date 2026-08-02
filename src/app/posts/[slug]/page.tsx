import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PostContent } from '@/components/blog/PostContent';
import { PostHeader } from '@/components/blog/PostHeader';
import { NextReads } from '@/components/blog/NextReads';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { selectNextReads } from '@/lib/editorial';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    ...(post.coverImage ? { image: post.coverImage } : {}),
    datePublished: post.date,
    author: { '@type': 'Person', name: SITE_NAME },
    publisher: { '@type': 'Person', name: SITE_NAME },
    url: `${SITE_URL}/posts/${post.slug}`,
  };

  return (
    <>
      <article className="reader-shell page-frame">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <PostHeader post={post} />
        <div className="reader-layout">
          <div className="min-w-0">
            <PostContent body={post.body} />
          </div>
          <TableOfContents items={post.toc} />
        </div>
      </article>
      <NextReads posts={selectNextReads(getAllPosts(), post, 3)} />
    </>
  );
}
