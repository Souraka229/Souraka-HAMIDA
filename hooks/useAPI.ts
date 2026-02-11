import { useState, useCallback } from 'react'
import { ApiResponse, ApiError } from '@/lib/types'

interface UseAPIOptions {
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
}

export function useAPI<T = any>(
  options?: UseAPIOptions
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<ApiError | null>(null)
  const [loading, setLoading] = useState(false)

  const request = useCallback(
    async (
      url: string,
      config: RequestInit = {}
    ): Promise<ApiResponse<T>> => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
            ...config.headers,
          },
          ...config,
        })

        const result: ApiResponse<T> = await response.json()

        if (!response.ok) {
          const apiError: ApiError = {
            code: result.error || 'UNKNOWN_ERROR',
            message: result.message || 'An error occurred',
          }
          setError(apiError)
          options?.onError?.(apiError)
          return result
        }

        if (result.data) {
          setData(result.data)
          options?.onSuccess?.(result.data)
        }

        return result
      } catch (err) {
        const apiError: ApiError = {
          code: 'NETWORK_ERROR',
          message: err instanceof Error ? err.message : 'Network error',
        }
        setError(apiError)
        options?.onError?.(apiError)
        return { success: false, error: apiError.message }
      } finally {
        setLoading(false)
      }
    },
    [options]
  )

  const post = useCallback(
    async (url: string, body: any) => {
      return request(url, {
        method: 'POST',
        body: JSON.stringify(body),
      })
    },
    [request]
  )

  const get = useCallback(
    async (url: string) => {
      return request(url, { method: 'GET' })
    },
    [request]
  )

  const put = useCallback(
    async (url: string, body: any) => {
      return request(url, {
        method: 'PUT',
        body: JSON.stringify(body),
      })
    },
    [request]
  )

  const del = useCallback(
    async (url: string) => {
      return request(url, { method: 'DELETE' })
    },
    [request]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    data,
    error,
    loading,
    request,
    get,
    post,
    put,
    delete: del,
    reset,
  }
}

export default useAPI
