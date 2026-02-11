'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, Code2, BarChart3, Presentation, Zap, Users, Shield, Menu, X, Sparkles } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    setIsAuthenticated(!!token)
  }, [])

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/auth/register')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border backdrop-blur-md sticky top-0 z-50 bg-background/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">BuildStudio</span>
            </Link>

            {/* Desktop menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">
                How It Works
              </a>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('auth_token')
                      router.push('/')
                    }}
                    className="text-muted-foreground hover:text-foreground transition"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <a href="#features" className="block px-4 py-2 text-muted-foreground hover:text-foreground transition">
                Features
              </a>
              <a href="#how-it-works" className="block px-4 py-2 text-muted-foreground hover:text-foreground transition">
                How It Works
              </a>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="block px-4 py-2">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('auth_token')
                      router.push('/')
                      setMobileMenuOpen(false)
                    }}
                    className="block px-4 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-4 py-2">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
        <div className="inline-block mb-4 px-4 py-1 bg-accent/20 rounded-full text-sm font-medium text-accent">
          AI-Powered Development Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Build Amazing Software in Minutes
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
          Generate production-ready code, create stunning data visualizations, and build professional presentations with AI assistance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition inline-flex items-center justify-center gap-2"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 border border-border text-foreground rounded-lg font-medium hover:bg-accent/5 transition">
            Watch Demo
          </button>
        </div>

        <div className="relative h-64 md:h-96 bg-gradient-to-b from-primary/20 via-accent/20 to-transparent rounded-xl border border-border overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Powerful Features</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Code2, title: 'Code Generation', desc: 'Generate clean, modular, production-ready code for any framework or language using AI.' },
            { icon: BarChart3, title: 'Data Visualization', desc: 'Create stunning interactive charts from CSV, JSON, or SQL data sources.' },
            { icon: Presentation, title: 'Presentations', desc: 'Build professional PowerPoint presentations with data visualizations and custom themes.' },
            { icon: Zap, title: 'Lightning Fast', desc: 'Get results in seconds with our optimized AI generation engine.' },
            { icon: Users, title: 'Collaborative', desc: 'Share projects and work together with your team in real-time.' },
            { icon: Shield, title: 'Secure', desc: 'Your code and data are encrypted and protected with enterprise-grade security.' },
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition">
                <Icon size={32} className="text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: 1, title: 'Create Project', desc: 'Set up a new project and choose your preferred tools and frameworks.' },
            { step: 2, title: 'Configure', desc: 'Upload data, select visualization types, or describe your code requirements.' },
            { step: 3, title: 'Generate', desc: 'Let AI generate professional code, charts, and presentations instantly.' },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <p className="text-muted-foreground ml-16">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
        <p className="text-lg text-muted-foreground mb-8">Join thousands of developers creating amazing projects</p>

        <button
          onClick={handleGetStarted}
          className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition inline-flex items-center gap-2"
        >
          {isAuthenticated ? 'Go to Dashboard' : 'Start Building Today'} <ArrowRight size={20} />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 text-center text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; 2025 BuildStudio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
