/**
 * Système de logging robuste pour Vercel
 * Enregistre les erreurs et events pour debugging en production
 */

interface LogContext {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR'
  context: string
  [key: string]: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatLog(log: LogContext): string {
    return JSON.stringify(log, null, this.isDevelopment ? 2 : 0)
  }

  info(context: string, data?: any): void {
    const log: LogContext = {
      timestamp: new Date().toISOString(),
      level: 'INFO',
      context,
      ...data,
    }
    console.log(this.formatLog(log))
  }

  warn(context: string, data?: any): void {
    const log: LogContext = {
      timestamp: new Date().toISOString(),
      level: 'WARN',
      context,
      ...data,
    }
    console.warn(this.formatLog(log))
  }

  error(context: string, error: unknown, data?: any): void {
    const log: LogContext = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      context,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...data,
    }
    console.error(this.formatLog(log))
  }
}

export const logger = new Logger()
