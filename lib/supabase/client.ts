import { createBrowserClient } from '@supabase/ssr'

// Fallback placeholders allow `next build` to succeed without env vars set.
// The real values come from Replit Secrets at runtime.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
  )
}
