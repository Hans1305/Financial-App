export function ProgressBar({ value, color }: { value: number; color: string }) {
  const clamped = Math.max(0, Math.min(1, value))
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
      <div className="h-full rounded-full" style={{ width: `${clamped * 100}%`, backgroundColor: color }} />
    </div>
  )
}

