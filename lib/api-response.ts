export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string): APIResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

export function errorResponse(error: string | Error, status?: number): APIResponse {
  const message = error instanceof Error ? error.message : error
  return {
    success: false,
    error: message,
  }
}

export function createErrorResponse(error: string, status: number = 400) {
  return {
    status,
    body: errorResponse(error),
  }
}

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return {
    status,
    body: successResponse(data),
  }
}
