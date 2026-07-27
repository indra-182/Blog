import type { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip';
  children?: ReactNode;
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const toneMap = {
    info: 'border-(--border) bg-(--surface-hover) text-(--text)',
    warning:
      'border-[#d99b3f] bg-[#fff7e6] text-[#7a4b00] dark:bg-[#2f2413] dark:text-[#ffd995]',
    tip: 'border-(--accent-soft) bg-(--accent-soft) text-(--text)',
  };

  return (
    <div className={`${toneMap[type]} my-6 border p-4 rounded-sm`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wider">
        {type}
      </span>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}
