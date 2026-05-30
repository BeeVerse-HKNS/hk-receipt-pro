import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const serverClient = await createServerComponentClient()
    const { data: { user } } = await serverClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { month, year } = await request.json()

    if (!month || !year) {
      return NextResponse.json({ error: 'Month and year are required' }, { status: 400 })
    }

    const { data: profile } = await serverClient
      .from('profiles')
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const nextMonth = month === 12 ? 1 : month + 1
    const nextYear = month === 12 ? year + 1 : year
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`

    let receiptQuery = serverClient
      .from('receipts')
      .select('total_amount')
      .gte('receipt_date', startDate)
      .lt('receipt_date', endDate)

    if (profile?.role === 'admin' && profile?.company_id) {
      receiptQuery = receiptQuery.eq('company_id', profile.company_id)
    } else {
      receiptQuery = receiptQuery.eq('user_id', user.id)
    }

    const { data: receipts } = await receiptQuery

    const totalAmount = (receipts || []).reduce((sum, r) => sum + (r.total_amount || 0), 0)

    const { data: report, error } = await serverClient
      .from('expense_reports')
      .insert({
        user_id: user.id,
        company_id: profile?.company_id,
        month,
        year,
        status: 'draft',
        total_amount: Math.round(totalAmount * 100) / 100,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ report })
  } catch {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
