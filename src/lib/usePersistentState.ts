import { useEffect, useMemo, useState } from 'react'

type PersistedMessage<T> = {
  key: string
  value: T
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function usePersistentState<T>(storageKey: string, initialValue: T) {
  const channelName = useMemo(() => `pf_sync_${storageKey}`, [storageKey])
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    const parsed = safeParse<T>(window.localStorage.getItem(storageKey))
    return parsed ?? initialValue
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, JSON.stringify(value))

    if (!('BroadcastChannel' in window)) return
    const channel = new BroadcastChannel(channelName)
    channel.postMessage({ key: storageKey, value } satisfies PersistedMessage<T>)
    channel.close()
  }, [channelName, storageKey, value])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const onStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage) return
      if (event.key !== storageKey) return
      const next = safeParse<T>(event.newValue)
      if (next !== null) setValue(next)
    }

    window.addEventListener('storage', onStorage)

    if (!('BroadcastChannel' in window)) {
      return () => window.removeEventListener('storage', onStorage)
    }

    const channel = new BroadcastChannel(channelName)
    const onMessage = (event: MessageEvent<PersistedMessage<T>>) => {
      if (!event.data || event.data.key !== storageKey) return
      setValue(event.data.value)
    }
    channel.addEventListener('message', onMessage)

    return () => {
      window.removeEventListener('storage', onStorage)
      channel.removeEventListener('message', onMessage)
      channel.close()
    }
  }, [channelName, storageKey])

  return [value, setValue] as const
}

