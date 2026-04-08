import { formatMoneyFromCents } from '@/lib/money'
import type { BudgetCategory } from '@/lib/finance/types'
import { ProgressBar } from '@/components/ui/ProgressBar'

function getStatus(category: BudgetCategory) {
  if (category.limitCents <= 0) return { label: 'No limit', color: '#a1a1aa' }
  const ratio = category.spentCents / category.limitCents
  if (ratio >= 1) return { label: 'Over', color: '#ef4444' }
  if (ratio >= 0.9) return { label: 'Near', color: '#f59e0b' }
  return { label: 'Under', color: '#22c55e' }
}

export function BudgetCategoryRow({
  category,
  money,
}: {
  category: BudgetCategory
  money: { locale: string; currency: string }
}) {
  const status = getStatus(category)
  const ratio = category.limitCents > 0 ? category.spentCents / category.limitCents : 0

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{category.name}</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{category.group}</div>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">{status.label}</div>
          <div className="text-sm font-medium">
            {formatMoneyFromCents(category.spentCents, money)}
            <span className="text-zinc-500 dark:text-zinc-400">
              {' '}
              / {formatMoneyFromCents(category.limitCents, money)}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <ProgressBar value={ratio} color={status.color} />
      </div>
    </div>
  )
}

