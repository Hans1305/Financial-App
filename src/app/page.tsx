import { Dashboard } from '@/components/dashboard/Dashboard'

export default function Home() {
  return (
    <main className="min-h-full bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Dashboard />
      </div>
    </main>
  );
}
