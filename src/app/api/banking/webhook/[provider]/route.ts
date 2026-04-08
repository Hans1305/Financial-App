import { NextResponse } from 'next/server'

export async function POST(_request: Request, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params
  return NextResponse.json(
    {
      ok: false,
      provider,
      message:
        'Webhook endpoint scaffolded. Configure an Open Banking provider and signature verification before enabling.',
    },
    { status: 501 }
  )
}

