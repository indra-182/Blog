import type { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip';
  children?: ReactNode;
}

const labels = {
  info: 'Catatan',
  warning: 'Perhatian',
  tip: 'Tip',
};

export function Callout({ type = 'info', children }: CalloutProps) {
  return (
    <aside className={`callout callout--${type} my-8`} aria-label={labels[type]}>
      <span className="callout__label">{labels[type]}</span>
      <div className="text-sm leading-relaxed">{children}</div>
    </aside>
  );
}
