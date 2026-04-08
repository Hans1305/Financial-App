'use client'

import { useMemo, useState } from 'react'
import type { Account, BudgetCategory } from '@/lib/finance/types'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { toCents } from '@/lib/money'

type Props = {
  accounts: Account[]
  categories: BudgetCategory[]
  onAddExpense: (payload: {
    txnDate: string
    accountId: string
    categoryId: string
    merchant: string
    description: string
    amountCents: number
  }) => void
}

export function TransactionForm({ accounts, categories, onAddExpense }: Props) {
  const expenseCategories = useMemo(
    () => categories.filter((c) => c.limitCents >= 0),
    [categories]
  )

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [txnDate, setTxnDate] = useState(today)
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '')
  const [categoryId, setCategoryId] = useState(expenseCategories[0]?.id ?? '')
  const [merchant, setMerchant] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [groceryLines, setGroceryLines] = useState('')

  const canSubmit = Boolean(accountId && categoryId && txnDate && Number(amount) > 0)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Date</div>
          <Input type="date" value={txnDate} onChange={(e) => setTxnDate(e.target.value)} />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Amount (ZAR)</div>
          <Input
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Account</div>
          <Select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Category</div>
          <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Merchant</div>
          <Input placeholder="e.g., Checkers" value={merchant} onChange={(e) => setMerchant(e.target.value)} />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Description</div>
          <Input
            placeholder="e.g., Groceries"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Grocery list (one item per line)</div>
        <Textarea
          placeholder="Milk\nBread\nChicken\nVeg"
          value={groceryLines}
          onChange={(e) => setGroceryLines(e.target.value)}
        />
        <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Tip: use this for quick capture; later we’ll parse into line-items.
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Expenses are recorded as negative amounts.</div>
        <Button
          disabled={!canSubmit}
          onClick={() => {
            const value = Number(amount)
            if (!value || value <= 0) return

            const groceryItemCount = groceryLines.split(/\r?\n/).filter(Boolean).length
            const derivedDescription = groceryLines.trim()
              ? `Grocery list (${groceryItemCount} items)`
              : 'Manual entry'

            onAddExpense({
              txnDate,
              accountId,
              categoryId,
              merchant: merchant.trim() || 'Manual entry',
              description: description.trim() || derivedDescription,
              amountCents: -toCents(value),
            })
            setAmount('')
            setMerchant('')
            setDescription('')
            setGroceryLines('')
          }}
        >
          Add expense
        </Button>
      </div>
    </div>
  )
}

