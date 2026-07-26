import type { Metadata } from 'next';
import { getPaginatedPosts, getAllCategories, getAllTags } from '@/lib/posts';
import { LatestPostsClient } from '@/components/blog/LatestPostsClient';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function Home() {
  const { posts } = getPaginatedPosts(1, 999);
  const categories = getAllCategories();
  const tags = getAllTags();

  return <LatestPostsClient posts={posts} categories={categories} tags={tags} />;
}
