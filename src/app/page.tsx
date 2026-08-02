import type { Metadata } from 'next';
import { LatestPostsClient } from '@/components/blog/LatestPostsClient';
import { buildEditorialHome } from '@/lib/editorial';
import { getAllCategories, getAllPosts, getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Home() {
  const posts = getAllPosts();
  return (
    <LatestPostsClient
      home={buildEditorialHome(posts)}
      categories={getAllCategories()}
      tags={getAllTags()}
    />
  );
}
