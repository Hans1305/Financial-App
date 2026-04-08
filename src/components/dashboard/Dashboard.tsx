'use client'

import { useEffect, useMemo, useState } from 'react'
import { SupabaseConfigBanner } from '@/components/SupabaseConfigBanner'
import { Card } from '@/components/ui/Card'
import { formatZarFromCents } from '@/lib/money'
import { demoAccounts, demoCategories, demoTransactions } from '@/lib/finance/demoData'
import type { Account, BudgetCategory, Transaction } from '@/lib/finance/types'
import { BudgetCategoryRow } from '@/components/dashboard/BudgetCategoryRow'
import { TransactionForm } from '@/components/dashboard/TransactionForm'
import { RecentTransactions } from '@/components/dashboard/RecentTransactions'
import { BankConnections } from '@/components/dashboard/BankConnections'
import { DashboardGraphs } from '@/components/dashboard/DashboardGraphs'

function buildId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

export function Dashboard() {
  const [userName, setUserName] = useState(() => {
    if (typeof window === 'undefined') return 'Michelle Andipatin'
    return window.localStorage.getItem('pf_user_name') ?? 'Michelle Andipatin'
  })
  const [accounts, setAccounts] = useState<Account[]>(demoAccounts)
  const [categories] = useState<BudgetCategory[]>(demoCategories)
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions)

  useEffect(() => {
    window.localStorage.setItem('pf_user_name', userName)
  }, [userName])

  const totalBalanceCents = useMemo(
    () => accounts.reduce((sum, a) => sum + a.balanceCents, 0),
    [accounts]
  )

  const totals = useMemo(() => {
    let income = 0
    let expenses = 0
    for (const t of transactions) {
      if (t.amountCents >= 0) income += t.amountCents
      else expenses += Math.abs(t.amountCents)
    }
    return { incomeCents: income, expensesCents: expenses, netCents: income - expenses }
  }, [transactions])

  const categoriesWithSpent = useMemo(() => {
    const spentByCategoryId = new Map<string, number>()
    for (const t of transactions) {
      if (t.amountCents >= 0) continue
      const prev = spentByCategoryId.get(t.categoryId) ?? 0
      spentByCategoryId.set(t.categoryId, prev + Math.abs(t.amountCents))
    }
    return categories.map((c) => ({ ...c, spentCents: spentByCategoryId.get(c.id) ?? 0 }))
  }, [categories, transactions])

  const grouped = useMemo(() => {
    const map = new Map<string, BudgetCategory[]>()
    for (const c of categoriesWithSpent) {
      const bucket = map.get(c.group) ?? []
      bucket.push(c)
      map.set(c.group, bucket)
    }
    return Array.from(map.entries()).map(([group, items]) => ({
      group,
      items: items.slice().sort((a, b) => a.name.localeCompare(b.name)),
    }))
  }, [categoriesWithSpent])

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Monthly overview</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Budget dashboard</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Name</div>
            <input
              className="h-9 w-64 rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-700"
              placeholder="e.g., Neville"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          Demo data (Phase 1 scaffold)
        </div>
      </div>

      <SupabaseConfigBanner />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total balances</div>
          <div className="mt-2 text-2xl font-semibold">{formatZarFromCents(totalBalanceCents)}</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Across all accounts</div>
        </Card>
        <Card>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Income</div>
          <div className="mt-2 text-2xl font-semibold text-emerald-700 dark:text-emerald-400">
            {formatZarFromCents(totals.incomeCents)}
          </div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">All transactions (demo)</div>
        </Card>
        <Card>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Expenses</div>
          <div className="mt-2 text-2xl font-semibold text-rose-600 dark:text-rose-400">
            {formatZarFromCents(totals.expensesCents)}
          </div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">All transactions (demo)</div>
        </Card>
        <Card>
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Net</div>
          <div className="mt-2 text-2xl font-semibold">{formatZarFromCents(totals.netCents)}</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Income minus expenses</div>
        </Card>
      </div>

      <DashboardGraphs categories={categoriesWithSpent} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Budget progress</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Spent vs monthly limits</div>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {grouped.map((g) => (
                <div key={g.group}>
                  <div className="mb-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300">{g.group}</div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {g.items.map((c) => (
                      <BudgetCategoryRow key={c.id} category={c} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <BankConnections
            accounts={accounts}
            onAddAccount={(account) => setAccounts((prev) => [account, ...prev])}
          />
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Quick add</div>
            <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Manual transaction entry</div>
            <div className="mt-4">
              <TransactionForm
                accounts={accounts}
                categories={categories}
                onAddExpense={(payload) => {
                  const txn: Transaction = {
                    id: buildId('txn'),
                    txnDate: payload.txnDate,
                    accountId: payload.accountId,
                    categoryId: payload.categoryId,
                    amountCents: payload.amountCents,
                    merchant: payload.merchant,
                    description: payload.description,
                  }

                  setTransactions((prev) => [txn, ...prev])

                  setAccounts((prev) =>
                    prev.map((a) =>
                      a.id === payload.accountId ? { ...a, balanceCents: a.balanceCents + payload.amountCents } : a
                    )
                  )
                }}
              />
            </div>
          </div>

          <RecentTransactions transactions={transactions} accounts={accounts} categories={categoriesWithSpent} />
        </div>
      </div>
    </div>
  )
}

