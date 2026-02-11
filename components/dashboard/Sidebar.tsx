'use client'

import Link from 'next/link'
import { Code, BarChart3, Presentation, Home, Settings } from 'lucide-react'

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-dark-surface-alt bg-dark-surface h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ProPlatform
        </Link>
      </div>

      <nav className="px-4 py-8 space-y-2">
        <NavLink icon={<Home size={20} />} label="Dashboard" href="/dashboard" />
        
        <div className="mt-8 px-4 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</h3>
        </div>
        
        <NavLink icon={<Code size={20} />} label="Code Generator" href="/projects/code" />
        <NavLink icon={<BarChart3 size={20} />} label="Visualizations" href="/projects/visualization" />
        <NavLink icon={<Presentation size={20} />} label="Presentations" href="/projects/presentation" />

        <div className="mt-8 px-4 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</h3>
        </div>
        
        <NavLink icon={<Settings size={20} />} label="Settings" href="/settings" />
      </nav>
    </aside>
  )
}

function NavLink({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-dark-surface-alt transition text-gray-300 hover:text-white">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  )
}
