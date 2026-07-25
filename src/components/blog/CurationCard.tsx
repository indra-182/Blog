import type { CurationItem } from '@/types/post'

interface CurationCardProps {
  items: CurationItem[]
}

export function CurationCard({ items }: CurationCardProps) {
  if (!items || items.length === 0) return null

  return (
    <div className="neo-card">
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i} className="border-b-2 border-black pb-4 last:border-b-0 last:pb-0">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-bold hover:text-(--neo-accent-1) transition-colors"
            >
              {item.title}
            </a>
            {item.source && (
              <p className="text-sm font-bold mt-1 text-(--neo-accent-2)">
                {item.source}
              </p>
            )}
            {item.insight && (
              <p className="mt-2 text-base leading-relaxed">{item.insight}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
