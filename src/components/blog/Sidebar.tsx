import Link from 'next/link';

interface SidebarProps {
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
}

export function Sidebar({ categories, tags }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      <div>
        <h2 className="mb-3 text-xs font-semibold tracking-wider text-(--text-weak) uppercase">
          Categories
        </h2>
        {categories.length === 0 && (
          <p className="text-sm text-(--text-weak)">No categories yet.</p>
        )}
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link
                href={`/category/${cat.name}`}
                className="flex items-center justify-between rounded-sm px-2 py-1 text-sm text-(--text) hover:bg-(--surface-hover) hover:text-(--accent)"
              >
                <span>{cat.name}</span>
                <span className="text-xs text-(--text-weak)">{cat.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 text-xs font-semibold tracking-wider text-(--text-weak) uppercase">
          Tags
        </h2>
        {tags.length === 0 && <p className="text-sm text-(--text-weak)">No tags yet.</p>}
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Link key={tag.name} href={`/tags/${tag.name}`} className="magic-tag text-xs">
              {tag.name} ({tag.count})
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
