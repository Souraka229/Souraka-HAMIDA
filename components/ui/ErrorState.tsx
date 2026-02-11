'use client'

import { ReactNode } from 'react'

interface ErrorStateProps {
  title: string
  message: string
  action?: ReactNode
}

export function ErrorState({ title, message, action }: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6">{message}</p>
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}
