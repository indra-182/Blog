import type { ComponentProps } from 'react';

type CodeChild = {
  props?: {
    className?: string;
    children?: unknown;
  };
};

export function CodeBlock(props: ComponentProps<'pre'>) {
  const codeElement = props.children as CodeChild | undefined;
  const className = codeElement?.props?.className ?? '';
  const titleChild = codeElement?.props?.children;
  const titleNode = Array.isArray(titleChild) ? titleChild[0] : undefined;
  const title =
    titleNode && typeof titleNode === 'object' && 'props' in titleNode
      ? (titleNode as CodeChild).props?.className?.includes('neo-code-title')
        ? String((titleNode as CodeChild).props?.children ?? '')
        : undefined
      : undefined;
  const language = className
    .split(' ')
    .find((part) => part.startsWith('language-'))
    ?.replace('language-', '');

  return (
    <div className="code-frame my-8 not-prose">
      {title && <div className="code-frame__title">{title}</div>}
      <pre {...props} className={title ? 'border-0' : undefined}>
        {language && <span className="sr-only">Kode {language}</span>}
        {props.children}
      </pre>
    </div>
  );
}
