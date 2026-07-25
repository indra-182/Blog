import type { ComponentProps } from 'react'

export function CodeBlock(props: ComponentProps<'pre'>) {
  const pre = props as ComponentProps<'pre'> & {
    children?: { props?: { className?: string; children?: unknown } }
  }

  const codeEl = pre.children as
    | { props?: { className?: string; children?: unknown } }
    | undefined

  const lang = codeEl?.props?.className
    ?.split(' ')
    .find((c) => c.startsWith('language-'))
    ?.replace('language-', '')

  let title: string | undefined
  const children = codeEl?.props?.children

  if (Array.isArray(children) && children.length > 1) {
    const first = children[0]
    if (
      first &&
      typeof first === 'object' &&
      'props' in (first as object)
    ) {
      const f = first as { props?: { className?: string; children?: unknown } }
      if (f.props?.className?.includes('neo-code-title')) {
        title = String(f.props?.children ?? '')
      }
    }
  }

  return (
    <div className="not-prose my-6">
      {title && (
        <div className="border-2 border-b-0 border-black bg-(--neo-accent-3) px-4 py-1 text-xs font-bold uppercase">
          {title}
        </div>
      )}
      <pre
        {...props}
        className={`border-[3px] border-black p-4 overflow-x-auto text-sm leading-relaxed ${lang ? `language-${lang}` : ''}`}
      />
    </div>
  )
}
