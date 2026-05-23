export interface Household {
  id: string
  name: string
  created_at: string
}

export interface DietaryFlags {
  gluten_free?: boolean
  nut_allergy?: boolean
  dairy_free?: boolean
  vegetarian?: boolean
  vegan?: boolean
}

export interface Member {
  id: string
  household_id: string
  name: string
  phone: string | null
  dietary_flags: DietaryFlags
  sms_enabled: boolean
  notes: string | null
  created_at: string
}

export interface NeverAgain {
  id: string
  household_id: string
  item: string
  created_at: string
}

export interface DoAgain {
  id: string
  household_id: string
  item: string
  created_at: string
}

export interface WeeklyPlan {
  id: string
  household_id: string
  week_start: string
  budget: number | null
  dietary_prefs: string[]
  cuisine_prefs: string[]
  avoid_items: string[]
  equipment: Record<string, boolean>
  cook_times: Record<string, string>
  created_at: string
}

export interface Nutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
}

export interface Recipe {
  ingredients: string[]
  steps: string[]
  servings?: number
}

export interface Meal {
  id: string
  plan_id: string
  night: string
  name: string
  cuisine: string | null
  cook_time_minutes: number | null
  equipment: string[]
  estimated_cost: number | null
  recipe: Recipe
  nutrition: Nutrition | null
  gluten_free_note: string | null
  rating: number | null
  notes: string | null
  status: 'planned' | 'made' | 'swapped' | 'skipped'
  created_at: string
}

export interface GroceryItem {
  id: string
  plan_id: string
  meal_id: string | null
  name: string
  category: string
  checked: boolean
  added_by: string | null
  is_community: boolean
  estimated_cost: number
  created_at: string
}

export interface MealTracking {
  id: string
  meal_id: string
  status: 'made' | 'swapped' | 'skipped'
  swap_description: string | null
  rating: number | null
  notes: string | null
  tracked_at: string
}

export interface HouseholdSettings {
  id: string
  household_id: string
  reminder_time: string
  reminder_enabled: boolean
  timezone: string
  google_access_token: string | null
  google_refresh_token: string | null
  google_token_expiry: string | null
}

export interface SmsLog {
  id: string
  member_id: string
  meal_id: string | null
  sent_at: string
  response: string | null
  responded_at: string | null
}
