'use client'

export class APIClient {
  private baseUrl: string

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' })
  }

  // Projects
  async getProjects() {
    return this.request('/dashboard/projects')
  }

  async createProject(name: string, description: string) {
    return this.request('/dashboard/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    })
  }

  // Code Generation
  async generateCode(prompt: string, framework: string, language: string) {
    return this.request('/generate/code', {
      method: 'POST',
      body: JSON.stringify({ prompt, framework, language }),
    })
  }

  // Settings
  async updateSettings(preferences: any) {
    return this.request('/settings', {
      method: 'POST',
      body: JSON.stringify(preferences),
    })
  }

  async getSettings() {
    return this.request('/settings')
  }

  // Export
  async exportPresentation(slides: any[], theme: any) {
    return this.request('/export/presentation', {
      method: 'POST',
      body: JSON.stringify({ slides, theme }),
    })
  }
}

export const apiClient = new APIClient()
