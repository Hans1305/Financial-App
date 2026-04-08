'use client'

import { useMemo } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/browserClient'

export function SupabaseConfigBanner() {
  const hasClient = useMemo(() => Boolean(getSupabaseBrowserClient()), [])

  if (hasClient) return null

  return (
    <div className="rounded-xl border border-amber-200/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-50">
      <div className="font-medium">Supabase is not configured yet</div>
      <div className="mt-1 text-amber-50/80">
        Add <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span> and{' '}
        <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span> to{' '}
        <span className="font-mono">.env.local</span>.
      </div>
    </div>
  )
}

