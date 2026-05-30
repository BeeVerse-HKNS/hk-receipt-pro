import { createServiceRoleClient } from './supabase-server'

export async function pingSupabase(): Promise<{ success: boolean; timestamp: string }> {
  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase
      .from('keep_alive_log')
      .insert({ status: 'alive' })

    if (error) throw error

    return { success: true, timestamp: new Date().toISOString() }
  } catch (err) {
    return { success: false, timestamp: new Date().toISOString() }
  }
}
