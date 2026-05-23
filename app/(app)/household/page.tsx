import { createClient } from '@/lib/supabase/server'
import HouseholdClient from './HouseholdClient'

export default async function HouseholdPage() {
  const supabase = createClient()

  const { data: households } = await supabase
    .from('households')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(1)

  const household = households?.[0] ?? null

  const { data: members } = household
    ? await supabase
        .from('members')
        .select('*')
        .eq('household_id', household.id)
        .order('created_at', { ascending: true })
    : { data: [] }

  return (
    <HouseholdClient
      initialHousehold={household}
      initialMembers={members ?? []}
    />
  )
}
