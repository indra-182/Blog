import type { ReactNode } from 'react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip'
  children?: ReactNode
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const bgMap = {
    info: 'bg-(--neo-accent-4)',
    warning: 'bg-(--neo-accent-1)',
    tip: 'bg-(--neo-accent-3)',
  }

  return (
    <div
      className={`${bgMap[type]} border-[3px] border-black p-4 my-4 font-bold`}
    >
      <span className="uppercase text-xs block mb-1">
        {type === 'info' ? 'Info' : type === 'warning' ? 'Warning' : 'Tip'}
      </span>
      <div className="font-medium">{children}</div>
    </div>
  )
}
