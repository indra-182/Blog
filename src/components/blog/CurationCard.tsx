import type { CurationItem } from '@/types/post';

interface CurationCardProps {
  items: CurationItem[];
}

export function CurationCard({ items }: CurationCardProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="magic-card p-4">
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="border-b border-(--border) pb-3 last:border-b-0 last:pb-0"
          >
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold tracking-tight text-(--text-strong) hover:text-(--accent)"
            >
              {item.title}
            </a>
            {item.source && (
              <p className="mt-0.5 text-xs text-(--accent)">{item.source}</p>
            )}
            {item.insight && (
              <p className="mt-1 text-sm leading-relaxed text-(--text)">{item.insight}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
