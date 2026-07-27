import type { ComponentProps } from 'react';

export function CodeBlock(props: ComponentProps<'pre'>) {
  const pre = props as ComponentProps<'pre'> & {
    children?: { props?: { className?: string; children?: unknown } };
  };

  const codeEl = pre.children as
    { props?: { className?: string; children?: unknown } } | undefined;

  const lang = codeEl?.props?.className
    ?.split(' ')
    .find((c) => c.startsWith('language-'))
    ?.replace('language-', '');

  let title: string | undefined;
  const children = codeEl?.props?.children;

  if (Array.isArray(children) && children.length > 1) {
    const first = children[0];
    if (first && typeof first === 'object' && 'props' in (first as object)) {
      const f = first as { props?: { className?: string; children?: unknown } };
      if (f.props?.className?.includes('neo-code-title')) {
        title = String(f.props?.children ?? '');
      }
    }
  }

  return (
    <div className="not-prose my-8">
      {title && (
        <div className="border border-b-0 border-(--border) bg-(--surface-hover) px-4 py-1.5 font-mono text-xs text-(--text-weak)">
          {title}
        </div>
      )}
      <pre
        {...props}
        className={`overflow-x-auto border border-(--border) bg-[#111116] p-5 font-mono text-sm leading-relaxed text-[#e5e7eb] ${!title ? '' : 'border-t-0'}`}
      />
    </div>
  );
}
