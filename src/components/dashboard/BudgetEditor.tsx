'use client'

import { useMemo, useState } from 'react'
import type { BudgetCategory, BudgetCategoryGroup } from '@/lib/finance/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { toCents } from '@/lib/money'

function buildId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

const GROUPS: BudgetCategoryGroup[] = [
  'Housing & Utilities',
  'Vehicles & Transport',
  'Living & Services',
  'Savings/Investments',
  'Other',
]

type Props = {
  categories: BudgetCategory[]
  onChangeCategories: (next: BudgetCategory[]) => void
}

export function BudgetEditor({ categories, onChangeCategories }: Props) {
  const sorted = useMemo(() => {
    return categories
      .slice()
      .sort((a, b) => (a.group === b.group ? a.name.localeCompare(b.name) : a.group.localeCompare(b.group)))
  }, [categories])

  const [group, setGroup] = useState<BudgetCategoryGroup>('Living & Services')
  const [name, setName] = useState('')
  const [limit, setLimit] = useState('')

  const canAdd = Boolean(name.trim() && Number(limit) >= 0)

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Budgets</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Add, edit, or remove category limits.</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Group</div>
          <Select value={group} onChange={(e) => setGroup(e.target.value as BudgetCategoryGroup)}>
            {GROUPS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Category</div>
          <Input placeholder="e.g., Gardening" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Monthly limit</div>
          <Input inputMode="decimal" placeholder="0.00" value={limit} onChange={(e) => setLimit(e.target.value)} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button
          disabled={!canAdd}
          onClick={() => {
            const limitValue = Number(limit)
            if (!Number.isFinite(limitValue) || limitValue < 0) return
            const next: BudgetCategory = {
              id: buildId('cat'),
              group,
              name: name.trim(),
              limitCents: toCents(limitValue),
              spentCents: 0,
            }
            onChangeCategories([next, ...categories])
            setName('')
            setLimit('')
          }}
        >
          Add category
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
        <div className="grid grid-cols-12 gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          <div className="col-span-5">Category</div>
          <div className="col-span-3">Group</div>
          <div className="col-span-3 text-right">Limit</div>
          <div className="col-span-1" />
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {sorted.map((c) => (
            <div key={c.id} className="grid grid-cols-12 items-center gap-2 px-3 py-2">
              <div className="col-span-5 min-w-0 truncate text-sm font-medium">{c.name}</div>
              <div className="col-span-3 truncate text-xs text-zinc-500 dark:text-zinc-400">{c.group}</div>
              <div className="col-span-3">
                <Input
                  className="h-9 text-right"
                  inputMode="decimal"
                  value={(c.limitCents / 100).toFixed(2)}
                  onChange={(e) => {
                    const nextValue = Number(e.target.value)
                    if (!Number.isFinite(nextValue) || nextValue < 0) return
                    onChangeCategories(categories.map((x) => (x.id === c.id ? { ...x, limitCents: toCents(nextValue) } : x)))
                  }}
                />
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  className="h-9 px-3"
                  onClick={() => onChangeCategories(categories.filter((x) => x.id !== c.id))}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

