'use client'

import { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="max-w-md">
        {icon && <div className="mb-4 flex justify-center">{icon}</div>}
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        {description && <p className="text-muted-foreground mb-6">{description}</p>}
        {action && <div>{action}</div>}
      </div>
    </div>
  )
}
