import Link from 'next/link'

interface SidebarProps {
  categories: { name: string; count: number }[]
  tags: { name: string; count: number }[]
}

export function Sidebar({ categories, tags }: SidebarProps) {
  return (
    <aside className="flex flex-col gap-6">
      <div className="neo-card">
        <h2 className="text-sm font-black uppercase mb-3 border-b-[3px] border-black pb-2">
          Categories
        </h2>
        {categories.length === 0 && (
          <p className="text-sm font-medium">No categories yet.</p>
        )}
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.name}>
              <Link
                href={`/category/${cat.name}`}
                className="flex items-center justify-between text-sm font-bold hover:text-(--neo-accent-1) transition-colors"
              >
                <span>{cat.name}</span>
                <span className="neo-tag text-xs">{cat.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="neo-card">
        <h2 className="text-sm font-black uppercase mb-3 border-b-[3px] border-black pb-2">
          Tags
        </h2>
        {tags.length === 0 && (
          <p className="text-sm font-medium">No tags yet.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.name}
              href={`/tags/${tag.name}`}
              className="neo-tag text-xs hover:bg-(--neo-accent-3) transition-colors"
            >
              {tag.name} ({tag.count})
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
