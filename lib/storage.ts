// Local storage utilities for client-side state management
export const storage = {
  // Project settings
  saveProjectSettings(projectId: string, settings: any) {
    if (typeof window === 'undefined') return
    localStorage.setItem(`project-${projectId}`, JSON.stringify(settings))
  },

  getProjectSettings(projectId: string) {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(`project-${projectId}`)
    return data ? JSON.parse(data) : null
  },

  // User preferences
  saveUserPreferences(preferences: any) {
    if (typeof window === 'undefined') return
    localStorage.setItem('user-preferences', JSON.stringify(preferences))
  },

  getUserPreferences() {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem('user-preferences')
    return data ? JSON.parse(data) : null
  },

  // Draft code
  saveDraft(projectId: string, code: string) {
    if (typeof window === 'undefined') return
    localStorage.setItem(`draft-${projectId}`, code)
  },

  getDraft(projectId: string) {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(`draft-${projectId}`)
  },

  removeDraft(projectId: string) {
    if (typeof window === 'undefined') return
    localStorage.removeItem(`draft-${projectId}`)
  },

  // Recent searches
  addRecentSearch(query: string) {
    if (typeof window === 'undefined') return
    const searches = this.getRecentSearches()
    const updated = [query, ...searches].slice(0, 10)
    localStorage.setItem('recent-searches', JSON.stringify(updated))
  },

  getRecentSearches() {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem('recent-searches')
    return data ? JSON.parse(data) : []
  },

  clearRecentSearches() {
    if (typeof window === 'undefined') return
    localStorage.removeItem('recent-searches')
  },

  // Clear all
  clearAll() {
    if (typeof window === 'undefined') return
    localStorage.clear()
  },
}
