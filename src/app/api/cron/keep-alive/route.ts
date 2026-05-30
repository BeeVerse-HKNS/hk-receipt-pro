import { NextResponse } from 'next/server'
import { pingSupabase } from '@/lib/keep-alive'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await pingSupabase()

  if (!result.success) {
    return NextResponse.json({ error: 'Keep-alive failed' }, { status: 500 })
  }

  return NextResponse.json({ status: 'ok', timestamp: result.timestamp })
}
