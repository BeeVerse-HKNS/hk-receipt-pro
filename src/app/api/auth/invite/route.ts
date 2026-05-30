import { NextResponse } from 'next/server'
import { createServiceRoleClient, createServerComponentClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const supabase = await createServerComponentClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: callerProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!callerProfile || callerProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { email, name, role, department } = await request.json()

    if (!email || !name || !role) {
      return NextResponse.json({ error: 'Email, name, and role are required' }, { status: 400 })
    }

    const serviceClient = createServiceRoleClient()

    const tempPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2).toUpperCase() + '!1'

    const { data: authData, error: authError } = await serviceClient.auth.signUp({
      email,
      password: tempPassword,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    const { data: callerFullProfile } = await supabase
      .from('profiles')
      .select('company_id')
      .eq('id', user.id)
      .single()

    const { error: profileError } = await serviceClient.from('profiles').insert({
      id: authData.user!.id,
      company_id: callerFullProfile?.company_id,
      name,
      role,
      department,
    })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
