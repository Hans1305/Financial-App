'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { CountryCode } from '@/lib/finance/countries'
import { COUNTRIES } from '@/lib/finance/countries'

export type Profile = {
  id: string
  name: string
  countryCode: CountryCode
}

function buildId(prefix: string) {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`
}

type Props = {
  profiles: Profile[]
  activeProfileId: string
  onChangeActiveProfileId: (id: string) => void
  onUpsertProfile: (profile: Profile) => void
  onCreateProfile: (profile: Profile) => void
}

export function ProfileSwitcher({
  profiles,
  activeProfileId,
  onChangeActiveProfileId,
  onUpsertProfile,
  onCreateProfile,
}: Props) {
  const active = useMemo(() => profiles.find((p) => p.id === activeProfileId) ?? profiles[0], [profiles, activeProfileId])
  const [newName, setNewName] = useState('')
  const [newCountry, setNewCountry] = useState<CountryCode>('ZA')

  const canCreate = Boolean(newName.trim())

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold">Profile</div>
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Switch user name and country.</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Active user</div>
          <Select value={activeProfileId} onChange={(e) => onChangeActiveProfileId(e.target.value)}>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Name</div>
          <Input
            value={active?.name ?? ''}
            onChange={(e) => {
              if (!active) return
              onUpsertProfile({ ...active, name: e.target.value })
            }}
          />
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">Country</div>
        <Select
          value={active?.countryCode ?? 'ZA'}
          onChange={(e) => {
            if (!active) return
            onUpsertProfile({ ...active, countryCode: e.target.value as CountryCode })
          }}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name} ({c.currency})
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-200">Add another user</div>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <Input placeholder="e.g., Neville" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <Select value={newCountry} onChange={(e) => setNewCountry(e.target.value as CountryCode)}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            disabled={!canCreate}
            onClick={() => {
              const profile: Profile = { id: buildId('profile'), name: newName.trim(), countryCode: newCountry }
              onCreateProfile(profile)
              onChangeActiveProfileId(profile.id)
              setNewName('')
              setNewCountry('ZA')
            }}
          >
            Create user
          </Button>
        </div>
      </div>
    </div>
  )
}

