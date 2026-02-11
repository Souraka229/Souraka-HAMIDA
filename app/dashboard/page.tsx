'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Code2, BarChart3, Presentation, Sparkles, Clock, TrendingUp } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { LoadingState } from '@/components/ui/LoadingState'
import { EmptyState } from '@/components/ui/EmptyState'
import ProjectCard from '@/components/dashboard/ProjectCard'

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          router.push('/auth/login')
          return
        }

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
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Header title="Dashboard" subtitle="Welcome back! Create and manage your projects" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Welcome, {user?.email?.split('@')[0] || 'User'}!</h2>
          <p className="text-muted-foreground">Create powerful projects with AI-assisted generation</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
                <p className="text-3xl font-bold">{projects.length}</p>
              </div>
              <Sparkles size={32} className="text-primary" />
            </div>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Code Generated</p>
                <p className="text-3xl font-bold">0</p>
              </div>
              <Code2 size={32} className="text-accent" />
            </div>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Time Saved</p>
                <p className="text-3xl font-bold">0h</p>
              </div>
              <Clock size={32} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Create New Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Get Started</h3>
            <TrendingUp size={24} className="text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NewProjectCard
              icon={<Code2 size={28} />}
              title="Code Generator"
              description="Generate clean, modular code from natural language prompts"
              href="/editor/code"
              badge="Popular"
            />
            <NewProjectCard
              icon={<BarChart3 size={28} />}
              title="Visualizations"
              description="Create interactive charts from CSV, JSON, or database data"
              href="/editor/visualization"
              badge="New"
            />
            <NewProjectCard
              icon={<Presentation size={28} />}
              title="Presentations"
              description="Build professional PowerPoint presentations automatically"
              href="/editor/presentation"
            />
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <h3 className="text-2xl font-bold mb-6">Recent Projects</h3>
          <LoadingState isLoading={loading} loadingText="Loading projects...">
            {projects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                description="Create your first project using one of the tools above"
                icon={<Sparkles size={48} className="text-muted-foreground" />}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project: any) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </LoadingState>
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
  badge,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  badge?: string
}) {
  return (
    <Link href={href}>
      <div className="relative p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-card/50 transition cursor-pointer h-full flex flex-col items-start group">
        {badge && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-accent/20 text-accent text-xs font-medium rounded-full">
            {badge}
          </div>
        )}
        <div className="text-primary mb-4 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground flex-1 mb-4">{description}</p>
        <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
          Create <Plus size={16} />
        </div>
      </div>
    </Link>
  )
}
