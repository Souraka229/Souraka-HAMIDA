/**
 * Retry logic avec exponential backoff
 * Utile pour gérer les erreurs réseau et les timeouts
 */

import { logger } from './logger'

export interface RetryOptions {
  maxAttempts?: number
  delayMs?: number
  backoffMultiplier?: number
  onRetry?: (attempt: number, error: Error) => void
}

export class RetryError extends Error {
  constructor(
    message: string,
    public lastError: Error,
    public attempts: number
  ) {
    super(message)
    this.name = 'RetryError'
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    onRetry,
  } = options

  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxAttempts) {
        logger.error('Retry failed after max attempts', lastError, {
          attempts: maxAttempts,
          context: fn.name || 'anonymous',
        })
        throw new RetryError(
          `Failed after ${maxAttempts} attempts`,
          lastError,
          attempt
        )
      }

      const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1)
      logger.warn('Retry scheduled', {
        attempt,
        maxAttempts,
        delayMs: delay,
        error: lastError.message,
      })

      if (onRetry) {
        onRetry(attempt, lastError)
      }

      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError || new Error('Unknown retry error')
}

/**
 * Retry avec timeout
 */
export async function withRetryAndTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number = 30000,
  options: RetryOptions = {}
): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Operation timeout after ${timeoutMs}ms`)),
      timeoutMs
    )
  )

  return Promise.race([
    withRetry(fn, options),
    timeoutPromise,
  ])
}

/**
 * Retry avec circuit breaker
 */
export class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'

  constructor(
    private threshold: number = 5,
    private resetTimeoutMs: number = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) {
        this.state = 'HALF_OPEN'
        this.failures = 0
      } else {
        throw new Error('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await fn()
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED'
        this.failures = 0
      }
      return result
    } catch (error) {
      this.failures++
      this.lastFailureTime = Date.now()

      if (this.failures >= this.threshold) {
        this.state = 'OPEN'
      }

      throw error
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      threshold: this.threshold,
    }
  }

  reset() {
    this.state = 'CLOSED'
    this.failures = 0
  }
}
