import { NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const serverClient = await createServerComponentClient()
    const { data: { user } } = await serverClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await serverClient
      .from('profiles')
      .select('company_id, role, name')
      .eq('id', user.id)
      .single()

    let receiptQuery = serverClient.from('receipts').select('*')

    if (profile?.role === 'admin' && profile?.company_id) {
      receiptQuery = receiptQuery.eq('company_id', profile.company_id)
    } else {
      receiptQuery = receiptQuery.eq('user_id', user.id)
    }

    const { data: receipts, error } = await receiptQuery.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const allReceipts = receipts || []
    const totalReceipts = allReceipts.length
    const totalAmount = allReceipts.reduce((sum, r) => sum + (r.total_amount || 0), 0)
    const pendingCount = allReceipts.filter((r) => r.status === 'pending').length
    const approvedCount = allReceipts.filter((r) => r.status === 'approved').length

    const categoryBreakdown: Record<string, number> = {}
    for (const r of allReceipts) {
      const type = r.receipt_type || 'other'
      categoryBreakdown[type] = (categoryBreakdown[type] || 0) + (r.total_amount || 0)
    }

    const monthlyMap: Record<string, number> = {}
    for (const r of allReceipts) {
      if (r.receipt_date) {
        const month = r.receipt_date.substring(0, 7)
        monthlyMap[month] = (monthlyMap[month] || 0) + (r.total_amount || 0)
      }
    }

    const monthlyTrend = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount }))

    const recentReceipts = allReceipts.slice(0, 5)

    return NextResponse.json({
      totalReceipts,
      totalAmount,
      pendingCount,
      approvedCount,
      categoryBreakdown,
      monthlyTrend,
      recentReceipts,
      userName: profile?.name || '',
      role: profile?.role || 'employee',
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
