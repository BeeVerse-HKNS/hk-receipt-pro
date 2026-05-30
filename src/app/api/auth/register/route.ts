import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase-server'

export async function POST(request: Request) {
  try {
    const { companyName, industry, adminName, email, password } = await request.json()

    if (!companyName || !industry || !adminName || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const serviceClient = createServiceRoleClient()

    const { data: authData, error: authError } = await serviceClient.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (authData.user) {
      await serviceClient.auth.admin.updateUserById(authData.user.id, {
        email_confirm: true,
      })
    }

    const { data: companyData, error: companyError } = await serviceClient
      .from('companies')
      .insert({ name: companyName, industry })
      .select()
      .single()

    if (companyError) {
      return NextResponse.json({ error: companyError.message }, { status: 500 })
    }

    const { error: profileError } = await serviceClient.from('profiles').insert({
      id: authData.user!.id,
      company_id: companyData.id,
      name: adminName,
      role: 'admin',
    })

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId: authData.user!.id })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
