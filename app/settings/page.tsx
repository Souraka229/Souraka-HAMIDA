'use client'

import { useState } from 'react'
import { Save, Shield, Bell, Palette } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
    codeFormat: 'typescript',
  })

  const handleSave = async () => {
    try {
      // Save settings to server
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      alert('Settings saved!')
    } catch (error) {
      alert('Failed to save settings')
    }
  }

  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar />

      <main className="flex-1">
        <nav className="border-b border-dark-surface-alt px-8 py-4">
          <h1 className="text-2xl font-bold">Settings</h1>
        </nav>

        <div className="max-w-2xl mx-auto p-8 space-y-8">
          {/* Theme Settings */}
          <section className="bg-dark-surface-alt rounded-lg p-6 border border-dark-surface-alt">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Palette size={20} />
              Appearance
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) =>
                    setSettings({ ...settings, theme: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-dark-surface border border-dark-surface-alt rounded-lg focus:border-primary transition"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </section>

          {/* Code Settings */}
          <section className="bg-dark-surface-alt rounded-lg p-6 border border-dark-surface-alt">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield size={20} />
              Code Generation
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Default Language</label>
                <select
                  value={settings.codeFormat}
                  onChange={(e) =>
                    setSettings({ ...settings, codeFormat: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-dark-surface border border-dark-surface-alt rounded-lg focus:border-primary transition"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-save Code</label>
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) =>
                    setSettings({ ...settings, autoSave: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-dark-surface-alt"
                />
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="bg-dark-surface-alt rounded-lg p-6 border border-dark-surface-alt">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Bell size={20} />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Enable Notifications</label>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) =>
                    setSettings({ ...settings, notifications: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-dark-surface-alt"
                />
              </div>
            </div>
          </section>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <Save size={20} />
            Save Settings
          </button>
        </div>
      </main>
    </div>
  )
}
