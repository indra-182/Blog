import type { CurationItem } from '@/types/post';

interface CurationCardProps {
  items?: CurationItem[];
  compact?: boolean;
}

export function CurationCard({ items = [], compact = false }: CurationCardProps) {
  const visibleItems = compact ? items.slice(0, 3) : items;
  const Heading = compact ? 'h4' : 'h2';
  const content = (
    <>
      <Heading
        className={`${compact ? 'mb-3 text-base' : 'mb-4 text-lg'} font-black text-(--text-strong)`}
      >
        Tautan pilihan
      </Heading>
      {items.length === 0 ? (
        <p className="text-sm text-(--text-weak)">
          Belum ada tautan pilihan untuk kurasi ini.
        </p>
      ) : (
        <ul className="space-y-4">
          {visibleItems.map((item) => (
            <li
              key={`${item.url}-${item.title}`}
              className="border-b-2 border-(--border-muted) pb-4 last:border-b-0 last:pb-0"
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-black text-(--text-strong) underline decoration-(--accent) decoration-2 underline-offset-4 hover:text-(--accent-strong)"
              >
                {item.title}
              </a>
              {item.source && (
                <p className="mt-1 meta-line text-(--blue)">{item.source}</p>
              )}
              {!compact && item.insight && (
                <p className="mt-2 text-sm leading-relaxed text-(--text)">
                  {item.insight}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      {compact && items.length > visibleItems.length && (
        <p className="mt-3 text-sm font-bold text-(--text-weak)">
          +{items.length - visibleItems.length} tautan lainnya di halaman kurasi.
        </p>
      )}
    </>
  );

  if (compact)
    return <div className="border-t-2 border-(--border-muted) pt-4">{content}</div>;
  return (
    <section className="neo-panel p-4 sm:p-6" aria-label="Daftar tautan kurasi">
      {content}
    </section>
  );
}
