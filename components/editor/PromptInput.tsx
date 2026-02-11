'use client'

import { Send, Loader2 } from 'lucide-react'

interface PromptInputProps {
  prompt: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading?: boolean
}

export default function PromptInput({
  prompt,
  onChange,
  onSubmit,
  loading = false,
}: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onSubmit()
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Prompt</label>
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe what code you want to generate..."
        className="w-full h-48 px-4 py-3 bg-dark-surface-alt border border-dark-surface-alt rounded-lg focus:border-primary focus:bg-dark-surface transition resize-none"
      />
      <button
        onClick={onSubmit}
        disabled={loading || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Send size={18} />
            Generate Code
          </>
        )}
      </button>
    </div>
  )
}
