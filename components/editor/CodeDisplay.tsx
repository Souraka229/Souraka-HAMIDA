'use client'

interface CodeDisplayProps {
  code: string
  language?: string
}

export default function CodeDisplay({ code, language = 'typescript' }: CodeDisplayProps) {
  return (
    <div className="border border-dark-surface-alt rounded-lg overflow-hidden bg-dark-surface">
      <div className="bg-dark-surface-alt px-4 py-2 border-b border-dark-surface-alt flex items-center justify-between">
        <span className="text-sm font-mono text-gray-400">{language}</span>
      </div>
      <pre className="overflow-x-auto p-4 text-sm font-mono leading-relaxed">
        <code className="text-gray-300">{code}</code>
      </pre>
    </div>
  )
}
