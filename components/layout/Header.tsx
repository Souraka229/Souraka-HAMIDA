'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, LogOut, Settings } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/')
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-xl font-bold">
              BuildStudio
            </Link>
            {title && <span className="text-muted-foreground">/ {title}</span>}
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/settings" className="p-2 hover:bg-accent/10 rounded-lg transition">
              <Settings size={20} />
            </Link>
            <button onClick={handleLogout} className="p-2 hover:bg-accent/10 rounded-lg transition text-red-500">
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Subtitle */}
        {subtitle && <p className="text-sm text-muted-foreground pb-4">{subtitle}</p>}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border pt-4">
            <Link href="/settings" className="block px-4 py-2 hover:bg-accent/10 rounded-lg">
              Settings
            </Link>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-accent/10 rounded-lg text-red-500">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
