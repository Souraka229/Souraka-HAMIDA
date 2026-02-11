export interface CodeGenerationRequest {
  prompt: string
  language: 'typescript' | 'javascript' | 'python' | 'html'
  framework?: 'react' | 'nextjs' | 'vue' | 'svelte' | 'none'
  description?: string
}

export interface CodeGenerationResult {
  code: string
  language: string
  framework?: string
  explanation: string
  dependencies?: string[]
}

export function formatCode(code: string, language: string): string {
  // Basic code formatting
  if (language === 'typescript' || language === 'javascript') {
    return code
      .replace(/\n\s*\n/g, '\n') // Remove multiple blank lines
      .trim()
  }
  return code.trim()
}

export function extractDependencies(code: string): string[] {
  const imports = code.match(/^(?:import|require)\s+[^;]+;?/gm) || []
  const dependencies: Set<string> = new Set()

  imports.forEach((imp) => {
    const match = imp.match(/['"]([^'"]+)['"]/g)
    if (match) {
      match.forEach((m) => {
        const pkg = m.replace(/['"]/g, '')
        if (!pkg.startsWith('.') && !pkg.startsWith('/')) {
          dependencies.add(pkg)
        }
      })
    }
  })

  return Array.from(dependencies)
}

export function createTypeScriptTemplate(componentName: string): string {
  return `'use client'

import { useState } from 'react'

interface ${componentName}Props {
  // Add props here
}

export function ${componentName}({}: ${componentName}Props) {
  const [state, setState] = useState<any>(null)

  return (
    <div className="p-4">
      <h1>${componentName}</h1>
      {/* Add component content here */}
    </div>
  )
}`
}

export function createReactComponentTemplate(componentName: string): string {
  return `function ${componentName}() {
  const [state, setState] = React.useState(null)

  return (
    <div>
      <h1>${componentName}</h1>
      {/* Component content */}
    </div>
  )
}

export default ${componentName}`
}

export function createNextjsPageTemplate(pageName: string): string {
  return `export default function ${pageName}Page() {
  return (
    <main className="p-6">
      <h1>${pageName}</h1>
      {/* Page content */}
    </main>
  )
}`
}
