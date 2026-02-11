'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  icon?: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function FormButton({
  isLoading,
  icon,
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: FormButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary',
    outline: 'border border-border text-foreground hover:bg-accent focus:ring-primary',
  }

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''
      } inline-flex items-center gap-2 ${className || ''}`}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !isLoading && <span>{icon}</span>}
      {children}
    </button>
  )
}
