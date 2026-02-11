/**
 * Debugging utilities for development
 */

const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Log messages only in development
 */
export const debugLog = (label: string, data?: any) => {
  if (isDevelopment) {
    console.log(`[${label}]`, data || '')
  }
}

/**
 * Log errors
 */
export const debugError = (label: string, error: Error | unknown) => {
  console.error(`[ERROR ${label}]`, error)
}

/**
 * Log API responses
 */
export const debugAPI = (endpoint: string, response: any) => {
  if (isDevelopment) {
    console.log(`[API ${endpoint}]`, response)
  }
}

/**
 * Measure performance
 */
export const measurePerformance = async (
  label: string,
  fn: () => Promise<any>
) => {
  const start = performance.now()
  try {
    const result = await fn()
    const duration = performance.now() - start
    if (isDevelopment) {
      console.log(`[PERF ${label}] ${duration.toFixed(2)}ms`)
    }
    return result
  } catch (error) {
    const duration = performance.now() - start
    console.error(`[PERF ${label}] Failed after ${duration.toFixed(2)}ms`, error)
    throw error
  }
}

/**
 * Get environment info for debugging
 */
export const getDebugInfo = () => {
  if (!isDevelopment) return null

  return {
    environment: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A',
  }
}

/**
 * Validate API response
 */
export const validateResponse = (response: any, expectedFields: string[]) => {
  const missing = expectedFields.filter((field) => !(field in response))
  if (missing.length > 0) {
    console.warn('[VALIDATION] Missing fields:', missing)
    return false
  }
  return true
}
