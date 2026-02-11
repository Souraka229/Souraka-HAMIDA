'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Shield, Bell, Palette, LogOut, User } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { FormButton } from '@/components/ui/FormButton'

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
    codeFormat: 'typescript',
    framework: 'react',
  })

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      router.push('/auth/login')
      return
    }
    // Load user profile
    const loadUser = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        if (data.data) {
          setUser(data.data.user)
          setSettings({ ...settings, ...data.data.preferences })
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
    loadUser()
  }, [router])

  const handleSave = async () => {
    setLoading(true)
    setSaveSuccess(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Settings" subtitle="Manage your account and preferences" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Profile Section */}
        <div className="mb-12 p-6 rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <User size={20} />
              Profile
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-lg font-semibold mt-1">{user?.email || 'Loading...'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Account Created</label>
              <p className="text-lg font-semibold mt-1">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/50 text-green-600 text-sm">
            Settings saved successfully!
          </div>
        )}

        {/* Theme Settings */}
        <section className="mb-8 p-6 rounded-lg border border-border bg-card">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Palette size={20} />
            Appearance
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Code Settings */}
        <section className="mb-8 p-6 rounded-lg border border-border bg-card">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield size={20} />
            Code Generation
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Default Language</label>
              <select
                value={settings.codeFormat}
                onChange={(e) => setSettings({ ...settings, codeFormat: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Default Framework</label>
              <select
                value={settings.framework}
                onChange={(e) => setSettings({ ...settings, framework: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
              >
                <option value="react">React</option>
                <option value="nextjs">Next.js</option>
                <option value="vue">Vue</option>
                <option value="svelte">Svelte</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="text-sm font-medium">Auto-save Code Drafts</label>
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                className="w-4 h-4 rounded border-border cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-8 p-6 rounded-lg border border-border bg-card">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Enable Email Notifications</label>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                className="w-4 h-4 rounded border-border cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <FormButton
            onClick={handleSave}
            isLoading={loading}
            className="flex-1"
          >
            <Save size={18} />
            Save Settings
          </FormButton>
          <button
            onClick={handleLogout}
            className="px-6 py-3 border border-red-500/50 text-red-500 rounded-lg hover:bg-red-500/10 transition font-medium flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </main>
    </div>
  )
}
