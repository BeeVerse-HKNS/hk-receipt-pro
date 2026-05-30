import { NextResponse } from 'next/server'
import { createServerComponentClient, createServiceRoleClient } from '@/lib/supabase-server'

export async function GET() {
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
      .select('role, company_id')
      .eq('id', user.id)
      .single()

    if (!callerProfile || callerProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const { data: employees, error } = await supabase
      .from('profiles')
      .select('id, name, role, department')
      .eq('company_id', callerProfile.company_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const serviceClient = createServiceRoleClient()

    const employeesWithEmail = await Promise.all(
      (employees || []).map(async (emp) => {
        const { data: authUser } = await serviceClient.auth.admin.getUserById(emp.id)
        return {
          id: emp.id,
          name: emp.name,
          role: emp.role,
          department: emp.department,
          email: authUser?.user?.email || '',
        }
      })
    )

    return NextResponse.json({ employees: employeesWithEmail })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
