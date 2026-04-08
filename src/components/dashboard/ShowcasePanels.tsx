'use client'

import { useMemo } from 'react'
import type { BudgetCategory } from '@/lib/finance/types'
import { formatMoneyFromCents } from '@/lib/money'

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[270px]">
      <div className="rounded-[34px] bg-zinc-900 p-[10px] shadow-sm">
        <div className="rounded-[26px] bg-white p-3 dark:bg-zinc-950">{children}</div>
      </div>
    </div>
  )
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-3 text-center text-sm font-semibold text-white">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function SyncIllustration() {
  return (
    <div className="flex items-center justify-center py-6">
      <svg width="190" height="160" viewBox="0 0 190 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M63 78c-11 0-20-9-20-20 0-9 6-17 15-19 3-14 16-24 31-24 16 0 29 11 32 26 11 1 19 10 19 21 0 12-9 22-21 22H63z"
          fill="#2563eb"
          opacity="0.9"
        />
        <path d="M95 88v36" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M95 88l-10 10" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M95 88l10 10" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M95 124l-10-10" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <path d="M95 124l10-10" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
        <rect x="40" y="122" width="110" height="18" rx="4" fill="#e4e4e7" />
        <rect x="62" y="112" width="66" height="44" rx="6" fill="#f4f4f5" />
        <rect x="70" y="118" width="50" height="28" rx="4" fill="#d4d4d8" />
      </svg>
    </div>
  )
}

function CurrencyRatePanel({ baseCurrency }: { baseCurrency: string }) {
  const nowLabel = useMemo(() => new Date().toLocaleString(), [])
  const rows = useMemo(
    () => [
      { code: 'USD', name: 'United States Dollar', rate: 18.45 },
      { code: 'EUR', name: 'Euro', rate: 20.1 },
      { code: 'GBP', name: 'British Pound', rate: 23.5 },
      { code: 'CAD', name: 'Canadian Dollar', rate: 13.6 },
      { code: 'AUD', name: 'Australian Dollar', rate: 12.1 },
      { code: 'ZAR', name: 'South African Rand', rate: 1 },
    ],
    []
  )

  return (
    <PhoneFrame>
      <div className="rounded-xl bg-emerald-600 px-3 py-2 text-white">
        <div className="text-sm font-semibold">Currency rate</div>
        <div className="mt-0.5 text-[11px] text-emerald-50/90">Last update: {nowLabel}</div>
      </div>
      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div key={r.code} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">{r.code}</div>
              <div className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">{r.name}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{r.rate.toFixed(2)}</div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">per {baseCurrency}</div>
              </div>
              <div className="rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-semibold text-white">CHECK</div>
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  )
}

function MonthlyReportPanel({ categories, money }: { categories: BudgetCategory[]; money: { locale: string; currency: string } }) {
  const months = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      return d.toLocaleString(money.locale, { month: 'short', year: '2-digit' })
    })
  }, [money.locale])

  const series = useMemo(() => {
    const groups = Array.from(new Set(categories.map((c) => c.group))).sort((a, b) => a.localeCompare(b))
    const totalsByGroup = new Map(groups.map((g) => [g, 0]))
    for (const c of categories) {
      totalsByGroup.set(c.group, (totalsByGroup.get(c.group) ?? 0) + c.spentCents)
    }

    const colors: Record<string, string> = {
      'Housing & Utilities': '#0ea5e9',
      'Vehicles & Transport': '#22c55e',
      'Living & Services': '#a855f7',
      'Savings/Investments': '#f59e0b',
      Other: '#64748b',
    }

    const weights = months.map((_, idx) => 0.65 + idx * 0.1)
    const weightSum = weights.reduce((a, b) => a + b, 0)

    const points = months.map((_, idx) => {
      const factor = weights[idx] / weightSum
      const values = groups.map((g) => ({
        group: g,
        valueCents: Math.round((totalsByGroup.get(g) ?? 0) * factor),
        color: colors[g] ?? '#64748b',
      }))
      const totalCents = values.reduce((sum, v) => sum + v.valueCents, 0)
      return { values, totalCents }
    })

    const maxTotal = Math.max(...points.map((p) => p.totalCents), 1)
    return { points, maxTotal }
  }, [categories, months])

  return (
    <PhoneFrame>
      <div className="rounded-xl bg-emerald-600 px-3 py-2 text-white">
        <div className="text-sm font-semibold">Monthly report</div>
        <div className="mt-0.5 text-[11px] text-emerald-50/90">By category</div>
      </div>

      <div className="mt-3 flex items-end gap-2 px-1">
        {series.points.map((p, idx) => {
          const h = Math.max(12, Math.round((p.totalCents / series.maxTotal) * 92))
          return (
            <div key={months[idx]} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex w-full items-end overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800" style={{ height: `${h}px` }}>
                {p.values
                  .filter((v) => v.valueCents > 0)
                  .map((v) => {
                    const ratio = p.totalCents > 0 ? v.valueCents / p.totalCents : 0
                    return <div key={v.group} style={{ width: `${Math.max(1, Math.round(ratio * 100))}%`, backgroundColor: v.color }} />
                  })}
              </div>
              <div className="w-full truncate text-center text-[10px] text-zinc-500 dark:text-zinc-400">{months[idx]}</div>
            </div>
          )
        })}
      </div>

      <div className="mt-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
        Total spend: {formatMoneyFromCents(categories.reduce((s, c) => s + c.spentCents, 0), money)}
      </div>
    </PhoneFrame>
  )
}

function PieChartPanel({ categories, money }: { categories: BudgetCategory[]; money: { locale: string; currency: string } }) {
  const data = useMemo(() => {
    const groupMap = new Map<string, number>()
    for (const c of categories) {
      groupMap.set(c.group, (groupMap.get(c.group) ?? 0) + c.spentCents)
    }
    const rows = Array.from(groupMap.entries())
      .map(([group, spentCents]) => ({ group, spentCents }))
      .filter((r) => r.spentCents > 0)
      .sort((a, b) => b.spentCents - a.spentCents)

    const total = rows.reduce((s, r) => s + r.spentCents, 0)
    const colors: Record<string, string> = {
      'Housing & Utilities': '#0ea5e9',
      'Vehicles & Transport': '#22c55e',
      'Living & Services': '#a855f7',
      'Savings/Investments': '#f59e0b',
      Other: '#ef4444',
    }

    const stops: string[] = []
    let acc = 0
    for (const r of rows) {
      const pct = total > 0 ? (r.spentCents / total) * 100 : 0
      const start = acc
      const end = acc + pct
      acc = end
      const color = colors[r.group] ?? '#64748b'
      stops.push(`${color} ${start.toFixed(2)}% ${end.toFixed(2)}%`)
    }

    return { rows, total, gradient: stops.length ? `conic-gradient(${stops.join(', ')})` : 'conic-gradient(#e5e7eb 0% 100%)' }
  }, [categories])

  return (
    <PhoneFrame>
      <div className="rounded-xl bg-emerald-600 px-3 py-2 text-white">
        <div className="text-sm font-semibold">Pie chart</div>
        <div className="mt-0.5 text-[11px] text-emerald-50/90">Budget report</div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div
          className="relative h-40 w-40 rounded-full"
          style={{ backgroundImage: data.gradient }}
          aria-label="Pie chart"
        >
          <div className="absolute inset-6 rounded-full bg-white shadow-sm dark:bg-zinc-950" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Total</div>
            <div className="mt-1 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              {formatMoneyFromCents(data.total, money)}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {data.rows.slice(0, 4).map((r) => {
          const pct = data.total > 0 ? (r.spentCents / data.total) * 100 : 0
          return (
            <div key={r.group} className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-300">
              <div className="truncate">{r.group}</div>
              <div className="shrink-0 font-semibold">{pct.toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    </PhoneFrame>
  )
}

export function ShowcasePanels({
  baseCurrency,
  categories,
  money,
}: {
  baseCurrency: string
  categories: BudgetCategory[]
  money: { locale: string; currency: string }
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Panel title="Data synchronization between devices">
        <SyncIllustration />
      </Panel>
      <Panel title="Actual exchange rates and currency converter">
        <CurrencyRatePanel baseCurrency={baseCurrency} />
      </Panel>
      <Panel title="Customizable reports">
        <MonthlyReportPanel categories={categories} money={money} />
      </Panel>
      <Panel title="Customizable reports">
        <PieChartPanel categories={categories} money={money} />
      </Panel>
    </div>
  )
}

