import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DollPlate — Family Meal Planning',
  description: 'AI-powered weekly dinner planning for your household',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  )
}
