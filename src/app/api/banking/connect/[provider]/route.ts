import { NextResponse } from 'next/server'

export async function GET(_request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params
  return NextResponse.json(
    {
      ok: false,
      provider,
      message:
        'Connection endpoint scaffolded. In Phase 5 this will start an OAuth/consent flow via your Open Banking provider.',
    },
    { status: 501 }
  )
}

