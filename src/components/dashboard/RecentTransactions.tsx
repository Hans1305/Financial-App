import type { Account, BudgetCategory, Transaction } from '@/lib/finance/types'
import { formatMoneyFromCents } from '@/lib/money'

export function RecentTransactions({
  transactions,
  accounts,
  categories,
  money,
}: {
  transactions: Transaction[]
  accounts: Account[]
  categories: BudgetCategory[]
  money: { locale: string; currency: string }
}) {
  const accountMap = new Map(accounts.map((a) => [a.id, a]))
  const categoryMap = new Map(categories.map((c) => [c.id, c]))

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div className="text-sm font-semibold">Recent transactions</div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Newest first</div>
      </div>
      <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {transactions.slice(0, 8).map((t) => {
          const account = accountMap.get(t.accountId)
          const category = categoryMap.get(t.categoryId)
          const isExpense = t.amountCents < 0

          return (
            <div key={t.id} className="grid grid-cols-12 gap-2 px-4 py-3">
              <div className="col-span-3 text-xs text-zinc-500 dark:text-zinc-400 sm:col-span-2">{t.txnDate}</div>
              <div className="col-span-5 min-w-0 sm:col-span-4">
                <div className="truncate text-sm font-medium">{t.merchant}</div>
                <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">{t.description}</div>
              </div>
              <div className="col-span-4 min-w-0 text-right sm:col-span-4 sm:text-left">
                <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {account?.name ?? 'Unknown account'}
                </div>
                <div className="truncate text-sm">{category?.name ?? 'Uncategorized'}</div>
              </div>
              <div
                className={[
                  'col-span-12 text-right text-sm font-semibold sm:col-span-2',
                  isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400',
                ].join(' ')}
              >
                {formatMoneyFromCents(t.amountCents, money)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

