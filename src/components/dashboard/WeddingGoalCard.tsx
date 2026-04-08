'use client'

import { useMemo } from 'react'
import { formatMoneyFromCents } from '@/lib/money'

type Props = {
  targetCents: number
  paidCents: number
  deadlineIso: string
  weddingIso: string
  money: { locale: string; currency: string }
}

function daysBetween(a: Date, b: Date) {
  const ms = b.getTime() - a.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

export function WeddingGoalCard({ targetCents, paidCents, deadlineIso, weddingIso, money }: Props) {
  const remainingCents = Math.max(0, targetCents - paidCents)
  const ratio = targetCents > 0 ? Math.min(1, paidCents / targetCents) : 0

  const meta = useMemo(() => {
    const now = new Date()
    const deadline = new Date(`${deadlineIso}T00:00:00`)
    const wedding = new Date(`${weddingIso}T00:00:00`)
    const daysLeft = Math.max(0, daysBetween(now, deadline))
    const monthsLeft = Math.max(1, Math.ceil(daysLeft / 30))
    const perMonth = Math.ceil(remainingCents / monthsLeft)
    const perDay = daysLeft > 0 ? Math.ceil(remainingCents / daysLeft) : remainingCents
    return {
      daysLeft,
      perMonth,
      perDay,
      deadlineLabel: deadline.toLocaleDateString(money.locale, { year: 'numeric', month: 'short', day: '2-digit' }),
      weddingLabel: wedding.toLocaleDateString(money.locale, { year: 'numeric', month: 'short', day: '2-digit' }),
    }
  }, [deadlineIso, money.locale, remainingCents, weddingIso])

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Bryn’s wedding fund</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Goal: {formatMoneyFromCents(targetCents, money)} · Wedding: {meta.weddingLabel}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">Due by</div>
          <div className="text-sm font-semibold">{meta.deadlineLabel}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-300">
          <div>Paid: {formatMoneyFromCents(paidCents, money)}</div>
          <div>Remaining: {formatMoneyFromCents(remainingCents, money)}</div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div className="h-full bg-emerald-500" style={{ width: `${Math.round(ratio * 100)}%` }} />
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
            Days left: <span className="font-semibold">{meta.daysLeft}</span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
            Needed / month: <span className="font-semibold">{formatMoneyFromCents(meta.perMonth, money)}</span>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
            Needed / day: <span className="font-semibold">{formatMoneyFromCents(meta.perDay, money)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

