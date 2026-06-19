import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
    supabaseUrl = 'https://placeholder-project.supabase.co'
    supabaseKey = 'placeholder-anon-key'
  }
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}
