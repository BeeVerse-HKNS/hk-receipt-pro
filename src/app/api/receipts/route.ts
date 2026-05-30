import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const serverClient = await createServerComponentClient()
    const { data: { user } } = await serverClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await serverClient
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const receipt_type = searchParams.get('receipt_type')
    const date_from = searchParams.get('date_from')
    const date_to = searchParams.get('date_to')

    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = serverClient
      .from('receipts')
      .select('*', { count: 'exact' })

    if (profile?.role === 'admin' && profile?.company_id) {
      query = query.eq('company_id', profile.company_id)
    } else {
      query = query.eq('user_id', user.id)
    }

    if (status) query = query.eq('status', status)
    if (receipt_type) query = query.eq('receipt_type', receipt_type)
    if (date_from) query = query.gte('receipt_date', date_from)
    if (date_to) query = query.lte('receipt_date', date_to)

    query = query.order('created_at', { ascending: false }).range(from, to)

    const { data: receipts, count, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      receipts,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch receipts' }, { status: 500 })
  }
}
