'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Plan', icon: '🍽️' },
  { href: '/grocery', label: 'Grocery', icon: '🛒' },
  { href: '/history', label: 'History', icon: '📖' },
  { href: '/household', label: 'Household', icon: '👨‍👩‍👧' },
]

export default function AppNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Top header */}
      <header className="bg-green-800 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <span className="font-bold text-xl tracking-tight">DollPlate</span>
        </div>
        <button
          onClick={signOut}
          className="text-sm text-green-200 hover:text-white transition-colors"
        >
          Sign out
        </button>
      </header>

      {/* Bottom nav (mobile-first) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50 shadow-lg">
        <div className="flex max-w-2xl mx-auto">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center py-2 text-xs font-medium transition-colors ${
                  active ? 'text-orange-500' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <span className="text-xl mb-0.5">{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
