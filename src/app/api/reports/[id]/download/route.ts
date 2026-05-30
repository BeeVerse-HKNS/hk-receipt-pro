import { NextRequest, NextResponse } from 'next/server'
import { createServerComponentClient } from '@/lib/supabase-server'
import { generateExpenseReport } from '@/lib/excel'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const serverClient = await createServerComponentClient()
    const { data: { user } } = await serverClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: report } = await serverClient
      .from('expense_reports')
      .select('*')
      .eq('id', id)
      .single()

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    if (report.user_id !== user.id) {
      const { data: profile } = await serverClient
        .from('profiles')
        .select('role, company_id')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin' || profile?.company_id !== report.company_id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const startDate = `${report.year}-${String(report.month).padStart(2, '0')}-01`
    const nextMonth = report.month === 12 ? 1 : report.month + 1
    const nextYear = report.month === 12 ? report.year + 1 : report.year
    const endDate = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`

    let receiptQuery = serverClient
      .from('receipts')
      .select('*')
      .gte('receipt_date', startDate)
      .lt('receipt_date', endDate)

    if (report.company_id) {
      receiptQuery = receiptQuery.eq('company_id', report.company_id)
    } else {
      receiptQuery = receiptQuery.eq('user_id', report.user_id)
    }

    const { data: receipts } = await receiptQuery

    const buffer = generateExpenseReport(receipts || [], report.month, report.year)

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="expense-report-${report.month}-${report.year}.xlsx"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to download report' }, { status: 500 })
  }
}
