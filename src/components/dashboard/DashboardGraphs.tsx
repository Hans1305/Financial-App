'use client'

import { useMemo } from 'react'
import type { BudgetCategory } from '@/lib/finance/types'
import { Card } from '@/components/ui/Card'
import { formatMoneyFromCents } from '@/lib/money'

const GROUP_COLORS: Record<string, string> = {
  'Housing & Utilities': '#0ea5e9',
  'Vehicles & Transport': '#22c55e',
  'Living & Services': '#a855f7',
  'Savings/Investments': '#f59e0b',
  Other: '#64748b',
}

function getColor(group: string) {
  return GROUP_COLORS[group] ?? '#64748b'
}

export function DashboardGraphs({
  categories,
  money,
}: {
  categories: BudgetCategory[]
  money: { locale: string; currency: string }
}) {
  const spendByGroup = useMemo(() => {
    const map = new Map<string, { group: string; spentCents: number; limitCents: number }>()
    for (const c of categories) {
      const row = map.get(c.group) ?? { group: c.group, spentCents: 0, limitCents: 0 }
      row.spentCents += c.spentCents
      row.limitCents += c.limitCents
      map.set(c.group, row)
    }
    return Array.from(map.values())
      .filter((g) => g.spentCents > 0 || g.limitCents > 0)
      .sort((a, b) => b.spentCents - a.spentCents)
  }, [categories])

  const totalSpentCents = useMemo(
    () => spendByGroup.reduce((sum, g) => sum + g.spentCents, 0),
    [spendByGroup]
  )

  const topCategories = useMemo(() => {
    return categories
      .filter((c) => c.spentCents > 0)
      .slice()
      .sort((a, b) => b.spentCents - a.spentCents)
      .slice(0, 6)
  }, [categories])

  const maxTopSpendCents = useMemo(() => {
    return topCategories.reduce((max, c) => Math.max(max, c.spentCents), 0)
  }, [topCategories])

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <div className="text-sm font-semibold">Spending by group</div>
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Share of total spend</div>

        <div className="mt-4">
          <div className="flex h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            {spendByGroup.map((g) => {
              const pct = totalSpentCents > 0 ? (g.spentCents / totalSpentCents) * 100 : 0
              return (
                <div
                  key={g.group}
                  style={{ width: `${pct}%`, backgroundColor: getColor(g.group) }}
                  title={`${g.group}: ${formatMoneyFromCents(g.spentCents, money)}`}
                />
              )
            })}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {spendByGroup.map((g) => {
            const ratio = g.limitCents > 0 ? g.spentCents / g.limitCents : 0
            return (
              <div key={g.group} className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: getColor(g.group) }} />
                  <div className="truncate text-xs font-medium">{g.group}</div>
                </div>
                <div className="shrink-0 text-right text-xs text-zinc-600 dark:text-zinc-300">
                  {formatMoneyFromCents(g.spentCents, money)}
                  {g.limitCents > 0 ? (
                    <span className="text-zinc-500 dark:text-zinc-400"> ({Math.round(ratio * 100)}%)</span>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <div className="text-sm font-semibold">Top categories</div>
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Highest spend this month</div>

        <div className="mt-4 flex h-40 items-end gap-2">
          {topCategories.length ? (
            topCategories.map((c) => {
              const pct = maxTopSpendCents > 0 ? c.spentCents / maxTopSpendCents : 0
              return (
                <div key={c.id} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg"
                    style={{ height: `${Math.max(6, Math.round(pct * 140))}px`, backgroundColor: getColor(c.group) }}
                    title={`${c.name}: ${formatMoneyFromCents(c.spentCents, money)}`}
                  />
                  <div className="w-full truncate text-center text-[11px] text-zinc-600 dark:text-zinc-300" title={c.name}>
                    {c.name}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">No spending yet.</div>
          )}
        </div>
      </Card>
    </div>
  )
}

