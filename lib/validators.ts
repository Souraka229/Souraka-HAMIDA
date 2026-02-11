export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8
}

export function isValidProjectName(name: string): boolean {
  return name.length >= 3 && name.length <= 100
}

export function validateCodePrompt(prompt: string): { valid: boolean; error?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, error: 'Prompt cannot be empty' }
  }
  if (prompt.length < 10) {
    return { valid: false, error: 'Prompt must be at least 10 characters' }
  }
  if (prompt.length > 2000) {
    return { valid: false, error: 'Prompt must be less than 2000 characters' }
  }
  return { valid: true }
}

export function validateCSVFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['text/csv', 'application/vnd.ms-excel']
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'File must be a valid CSV' }
  }
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File must be less than 10MB' }
  }
  return { valid: true }
}

export function validateJSONData(data: any): { valid: boolean; error?: string } {
  if (!Array.isArray(data)) {
    return { valid: false, error: 'JSON must be an array' }
  }
  if (data.length === 0) {
    return { valid: false, error: 'JSON array cannot be empty' }
  }
  if (typeof data[0] !== 'object' || data[0] === null) {
    return { valid: false, error: 'Array items must be objects' }
  }
  return { valid: true }
}
