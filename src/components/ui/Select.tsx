import type { SelectHTMLAttributes } from 'react'

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        'h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-4 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50',
        props.className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

