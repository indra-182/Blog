import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Tags',
  description: 'All tags',
  alternates: { canonical: '/tags' },
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div>
      <p className="magic-kicker mb-3">Browse by topic</p>
      <h1 className="magic-section-title">Tags</h1>

      {tags.length === 0 && <p className="text-lg text-(--text-weak)">No tags yet.</p>}

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${tag.name}`}
            className="magic-card magic-card--interactive magic-tag text-sm"
          >
            {tag.name} ({tag.count})
          </Link>
        ))}
      </div>
    </div>
  );
}
