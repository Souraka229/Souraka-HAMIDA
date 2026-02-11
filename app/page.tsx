'use client'

import Link from 'next/link'
import { ArrowRight, Code, BarChart3, Presentation } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg overflow-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-dark-surface-alt">
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          ProPlatform
        </div>
        <div className="flex gap-4">
          <Link href="/auth/login" className="px-6 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition">
            Sign In
          </Link>
          <Link href="/auth/register" className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 leading-tight">
          Professional <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Software Platform</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Generate clean, modular code • Create stunning visualizations • Build professional presentations • All in one place
        </p>
        <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-primary text-white hover:bg-blue-700 transition text-lg font-semibold">
          Start Building Now <ArrowRight size={20} />
        </Link>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Code size={32} />}
          title="Code Generation"
          description="Generate clean, modular, production-ready code with AI assistance"
        />
        <FeatureCard
          icon={<BarChart3 size={32} />}
          title="Data Visualizations"
          description="Create interactive, sophisticated charts and dashboards from any data source"
        />
        <FeatureCard
          icon={<Presentation size={32} />}
          title="Presentation Builder"
          description="Generate professional PowerPoint presentations with automated layouts"
        />
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div>
          <div className="text-4xl font-bold text-primary mb-2">10K+</div>
          <p className="text-gray-400">Developers</p>
        </div>
        <div>
          <div className="text-4xl font-bold text-secondary mb-2">50K+</div>
          <p className="text-gray-400">Projects Created</p>
        </div>
        <div>
          <div className="text-4xl font-bold text-accent mb-2">99%</div>
          <p className="text-gray-400">Satisfaction Rate</p>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-xl border border-dark-surface-alt bg-dark-surface hover:border-primary/50 transition hover:bg-dark-surface-alt">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
