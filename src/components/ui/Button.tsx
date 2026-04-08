import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

export function Button({ variant = 'primary', className, ...props }: Props) {
  const base =
    'inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium transition-colors disabled:opacity-50'
  const styles =
    variant === 'primary'
      ? 'bg-blue-600 text-white hover:bg-blue-500'
      : 'border border-zinc-200 bg-white text-zinc-950 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800'

  return <button className={[base, styles, className].filter(Boolean).join(' ')} {...props} />
}

