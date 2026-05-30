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
      .select('company_id, role')
      .eq('id', user.id)
      .single()

    let query = serverClient
      .from('expense_reports')
      .select('*')
      .order('created_at', { ascending: false })

    if (profile?.role === 'admin' && profile?.company_id) {
      query = query.eq('company_id', profile.company_id)
    } else {
      query = query.eq('user_id', user.id)
    }

    const { data: reports, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ reports: reports || [] })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}
