'use client'

import type { CountryCode } from '@/lib/finance/countries'
import { COUNTRIES } from '@/lib/finance/countries'
import { Select } from '@/components/ui/Select'

export function CountrySelector({ value, onChange }: { value: CountryCode; onChange: (v: CountryCode) => void }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Country</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Currency and bank list update automatically.</div>
        </div>
      </div>

      <div className="mt-4">
        <Select value={value} onChange={(e) => onChange(e.target.value as CountryCode)}>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name} ({c.currency})
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}

