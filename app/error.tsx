'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <AlertCircle size={64} className="text-accent" />
        </div>

        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-gray-400 mb-8">
          Something went wrong. Please try again or contact support.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <Link href="/" className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition">
            Go Home
          </Link>
        </div>
      </div>
    </main>
  )
}
