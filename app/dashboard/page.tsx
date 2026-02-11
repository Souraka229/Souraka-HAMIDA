'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Code, BarChart3, Presentation, Settings, LogOut } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import ProjectCard from '@/components/dashboard/ProjectCard'

export default function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Fetch user and projects
    const loadData = async () => {
      try {
        const res = await fetch('/api/dashboard/projects')
        const data = await res.json()
        setProjects(data.projects || [])
        setUser(data.user)
      } catch (error) {
        console.error('Failed to load projects:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/'
  }

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar />

      <main className="flex-1">
        {/* Top Navigation */}
        <nav className="border-b border-dark-surface-alt px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-dark-surface-alt transition"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="p-8">
          {/* Create New Section */}
          <div className="mb-12">
            <h2 className="text-xl font-bold mb-6">Create New Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NewProjectCard
                icon={<Code size={28} />}
                title="Code Generator"
                description="Generate clean, modular code from prompts"
                href="/editor/code"
              />
              <NewProjectCard
                icon={<BarChart3 size={28} />}
                title="Visualization"
                description="Create interactive data visualizations"
                href="/editor/visualization"
              />
              <NewProjectCard
                icon={<Presentation size={28} />}
                title="Presentation"
                description="Build professional PowerPoint slides"
                href="/editor/presentation"
              />
            </div>
          </div>

          {/* Recent Projects */}
          <div>
            <h2 className="text-xl font-bold mb-6">Recent Projects</h2>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No projects yet. Create your first one above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function NewProjectCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className="p-6 rounded-xl border border-dark-surface-alt bg-dark-surface hover:border-primary/50 hover:bg-dark-surface-alt transition cursor-pointer h-full flex flex-col items-start">
        <div className="text-primary mb-4">{icon}</div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-400 flex-1 mb-4">{description}</p>
        <div className="flex items-center gap-2 text-primary text-sm font-medium">
          Create <Plus size={16} />
        </div>
      </div>
    </Link>
  )
}
