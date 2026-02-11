'use client'

import { useState } from 'react'
import { Send, Copy, Download, Loader2 } from 'lucide-react'
import CodeDisplay from '@/components/editor/CodeDisplay'
import PromptInput from '@/components/editor/PromptInput'

export default function CodeEditorPage() {
  const [prompt, setPrompt] = useState('')
  const [framework, setFramework] = useState('react')
  const [language, setLanguage] = useState('typescript')
  const [generatedCode, setGeneratedCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedCode('')

    try {
      const response = await fetch('/api/generate/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, framework, language }),
      })

      if (!response.ok) {
        throw new Error('Generation failed')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        setGeneratedCode((prev) => prev + chunk)
      }
    } catch (err) {
      setError('Failed to generate code')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const handleDownload = () => {
    const element = document.createElement('a')
    const file = new Blob([generatedCode], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `code.${language}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Code Generator</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Framework</label>
              <select
                value={framework}
                onChange={(e) => setFramework(e.target.value)}
                className="w-full px-4 py-2 bg-dark-surface-alt border border-dark-surface-alt rounded-lg focus:border-primary focus:bg-dark-surface transition"
              >
                <option value="react">React</option>
                <option value="next">Next.js</option>
                <option value="vue">Vue</option>
                <option value="svelte">Svelte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 bg-dark-surface-alt border border-dark-surface-alt rounded-lg focus:border-primary focus:bg-dark-surface transition"
              >
                <option value="typescript">TypeScript</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
              </select>
            </div>

            <PromptInput
              prompt={prompt}
              onChange={setPrompt}
              onSubmit={handleGenerate}
              loading={loading}
            />

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-2">
            {generatedCode ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Generated Code</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      <Copy size={18} />
                      Copy
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition"
                    >
                      <Download size={18} />
                      Download
                    </button>
                  </div>
                </div>
                <CodeDisplay code={generatedCode} language={language} />
              </div>
            ) : (
              <div className="border-2 border-dashed border-dark-surface-alt rounded-lg p-12 text-center">
                {loading ? (
                  <div className="space-y-4">
                    <Loader2 className="mx-auto animate-spin" size={40} />
                    <p className="text-gray-400">Generating code...</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Enter a prompt and click generate to see code here</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
