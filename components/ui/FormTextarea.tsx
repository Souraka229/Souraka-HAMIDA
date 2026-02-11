'use client'

import { TextareaHTMLAttributes } from 'react'

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  maxLength?: number
}

export function FormTextarea({
  label,
  error,
  helperText,
  maxLength,
  value,
  className,
  ...props
}: FormTextareaProps) {
  const charCount = typeof value === 'string' ? value.length : 0

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-foreground">
          {label}
        </label>
      )}
      <textarea
        maxLength={maxLength}
        value={value}
        className={`w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        } ${className || ''}`}
        {...props}
      />
      <div className="flex justify-between items-start mt-2">
        {error ? <p className="text-sm text-red-500">{error}</p> : helperText ? <p className="text-sm text-muted-foreground">{helperText}</p> : <div />}
        {maxLength && <p className="text-xs text-muted-foreground">{charCount}/{maxLength}</p>}
      </div>
    </div>
  )
}
