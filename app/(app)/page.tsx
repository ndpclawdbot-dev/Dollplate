import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function HomePage() {
  const supabase = createClient()

  const { data: households } = await supabase
    .from('households')
    .select('*')
    .limit(1)

  const household = households?.[0] ?? null

  if (!household) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="text-6xl">🍽️</div>
        <h2 className="text-xl font-bold text-green-800">Welcome to DollPlate!</h2>
        <p className="text-stone-500">Start by setting up your household.</p>
        <Link href="/household" className="btn-primary inline-block">
          Set up household
        </Link>
      </div>
    )
  }

  // Get current week's plan if it exists
  const weekStart = getMonday(new Date()).toISOString().split('T')[0]
  const { data: plan } = await supabase
    .from('weekly_plans')
    .select('*, meals(*)')
    .eq('household_id', household.id)
    .eq('week_start', weekStart)
    .single()

  const hasPlan = !!plan

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-green-800">This week</h1>
          <p className="text-sm text-stone-500">{household.name}</p>
        </div>
        <Link href="/plan/new" className="btn-primary text-sm py-1.5 px-3">
          {hasPlan ? 'New plan' : 'Plan this week'}
        </Link>
      </div>

      {!hasPlan ? (
        <div className="card text-center py-12 space-y-3">
          <div className="text-5xl">🥗</div>
          <p className="text-stone-500 font-medium">No meal plan for this week yet.</p>
          <p className="text-stone-400 text-sm">
            Tap &ldquo;Plan this week&rdquo; to generate 7 dinners with AI.
          </p>
          <Link href="/plan/new" className="btn-primary inline-block mt-2">
            Plan this week
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {(plan.meals as { id: string; night: string; name: string; cuisine: string | null; cook_time_minutes: number | null; status: string }[])
            .sort((a, b) => new Date(a.night).getTime() - new Date(b.night).getTime())
            .map((meal) => (
              <div key={meal.id} className="card flex items-center gap-3">
                <div className="text-2xl w-8 text-center">
                  {mealEmoji(meal.cuisine)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-800 truncate">{meal.name}</p>
                  <p className="text-xs text-stone-400">
                    {formatNight(meal.night)} &middot; {meal.cuisine} &middot; {meal.cook_time_minutes}min
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusClass(meal.status)}`}
                >
                  {meal.status}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

function getMonday(date: Date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d
}

function formatNight(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function mealEmoji(cuisine: string | null) {
  const map: Record<string, string> = {
    Mexican: '🌮', Italian: '🍝', Asian: '🥢', BBQ: '🔥', American: '🍔',
    Mediterranean: '🥗', Greek: '🫒', Indian: '🍛', 'Comfort Food': '🍲',
  }
  return cuisine ? (map[cuisine] ?? '🍽️') : '🍽️'
}

function statusClass(status: string) {
  if (status === 'made') return 'bg-green-100 text-green-700'
  if (status === 'skipped') return 'bg-stone-100 text-stone-500'
  if (status === 'swapped') return 'bg-orange-100 text-orange-600'
  return 'bg-blue-50 text-blue-600'
}
