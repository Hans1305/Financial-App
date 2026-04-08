import type { TextareaHTMLAttributes } from 'react'

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        'min-h-24 w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none ring-blue-500/30 focus:ring-4 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50',
        props.className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}

