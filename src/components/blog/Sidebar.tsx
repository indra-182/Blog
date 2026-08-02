import Link from 'next/link';

interface SidebarProps {
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
  activeCategory?: string;
  activeTag?: string;
}

export function Sidebar({ categories, tags, activeCategory, activeTag }: SidebarProps) {
  return (
    <aside className="browse-rail" aria-label="Jelajahi topik">
      <div className="page-frame flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="meta-line text-(--accent-strong)">Kategori</span>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/category/${category.name}`}
              className="browse-rail__link"
              data-active={activeCategory === category.name}
            >
              {category.name}{' '}
              <span className="ms-2 text-xs opacity-70">{category.count}</span>
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/tags" className="meta-line hover:text-(--accent-strong)">
            Tag
          </Link>
          {tags.slice(0, 12).map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${tag.name}`}
              className="neo-tag"
              data-active={activeTag === tag.name}
            >
              {tag.name} <span className="ms-1 opacity-70">{tag.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
