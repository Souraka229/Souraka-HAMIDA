'use client'

import { InputHTMLAttributes, ReactNode } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: ReactNode
}

export function FormInput({
  label,
  error,
  helperText,
  icon,
  className,
  ...props
}: FormInputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          className={`w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className || ''}`}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      {helperText && !error && <p className="text-sm text-muted-foreground mt-1">{helperText}</p>}
    </div>
  )
}
