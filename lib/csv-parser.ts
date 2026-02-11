import Papa from 'papaparse'

export interface ParsedCSV {
  headers: string[]
  data: any[]
  error?: string
}

export function parseCSV(file: File): Promise<ParsedCSV> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors && results.errors.length > 0) {
          resolve({
            headers: [],
            data: [],
            error: results.errors[0].message,
          })
        } else {
          const headers = Object.keys(results.data[0] || {})
          resolve({
            headers,
            data: results.data,
          })
        }
      },
      error: (error) => {
        resolve({
          headers: [],
          data: [],
          error: error.message,
        })
      },
    })
  })
}

export function parseJSON(text: string): ParsedCSV {
  try {
    const data = JSON.parse(text)
    if (!Array.isArray(data)) {
      return {
        headers: [],
        data: [],
        error: 'JSON must be an array',
      }
    }
    const headers = data.length > 0 ? Object.keys(data[0]) : []
    return {
      headers,
      data,
    }
  } catch (error) {
    return {
      headers: [],
      data: [],
      error: error instanceof Error ? error.message : 'Invalid JSON',
    }
  }
}
