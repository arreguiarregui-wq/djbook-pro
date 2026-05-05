import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  return createSupabaseClient(
    'https://quxfxbfvsxxvcwauvnaz.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
