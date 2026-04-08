'use client'

import { useMemo, useState } from 'react'
import type { Account, AccountType } from '@/lib/finance/types'
import { SOUTH_AFRICAN_BANKS } from '@/lib/banking/saBanks'
import type { SouthAfricanBankId } from '@/lib/banking/saBanks'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { toCents } from '@/lib/money'

function buildId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

type Props = {
  accounts: Account[]
  onAddAccount: (account: Account) => void
}

export function BankConnections({ accounts, onAddAccount }: Props) {
  const [bankId, setBankId] = useState<SouthAfricanBankId>(SOUTH_AFRICAN_BANKS[0]?.id ?? 'absa')
  const [nickname, setNickname] = useState('')
  const [type, setType] = useState<AccountType>('checking')
  const [balance, setBalance] = useState('')

  const connectedBankNames = useMemo(() => {
    const set = new Set<string>()
    for (const a of accounts) {
      const match = SOUTH_AFRICAN_BANKS.find((b) => a.name.toLowerCase().includes(b.name.toLowerCase()))
      if (match) set.add(match.name)
    }
    return Array.from(set.values()).sort((a, b) => a.localeCompare(b))
  }, [accounts])

  const canAdd = Boolean(bankId && (nickname.trim() || '').length > 0 && Number(balance) >= 0)

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Bank accounts (South Africa)</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Add accounts manually now. Open Banking connections will be enabled in Phase 5.
          </div>
        </div>
        <div className="shrink-0 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-[11px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          Connected: {connectedBankNames.length ? connectedBankNames.join(', ') : 'None'}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Bank</div>
          <Select value={bankId} onChange={(e) => setBankId(e.target.value as SouthAfricanBankId)}>
            {SOUTH_AFRICAN_BANKS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Account name</div>
          <Input placeholder="e.g., Cheque card" value={nickname} onChange={(e) => setNickname(e.target.value)} />
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Type</div>
          <Select value={type} onChange={(e) => setType(e.target.value as AccountType)}>
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
            <option value="credit">Credit</option>
            <option value="cash">Cash</option>
          </Select>
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Starting balance (ZAR)</div>
          <Input
            inputMode="decimal"
            placeholder="0.00"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end">
        <Button
          disabled={!canAdd}
          onClick={() => {
            const bank = SOUTH_AFRICAN_BANKS.find((b) => b.id === bankId)
            if (!bank) return
            const balanceValue = Number(balance)
            if (!Number.isFinite(balanceValue) || balanceValue < 0) return

            onAddAccount({
              id: buildId('acct'),
              name: `${bank.name} — ${nickname.trim()}`,
              type,
              balanceCents: toCents(balanceValue),
            })

            setNickname('')
            setBalance('')
          }}
        >
          Add account
        </Button>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
        Automatic imports from Absa/FNB/Nedbank/Standard Bank/Capitec require a third‑party Open Banking provider.
        When enabled, the app will merge balances and transactions across all connected banks into one dashboard.
      </div>
    </div>
  )
}

