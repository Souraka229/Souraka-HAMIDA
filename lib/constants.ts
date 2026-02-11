/**
 * Application constants and configuration
 */

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// AI Models
export const DEFAULT_AI_MODEL = 'openai/gpt-4-turbo'
export const AI_TEMPERATURE = 0.7
export const AI_MAX_TOKENS = 4000

// Code Generation
export const SUPPORTED_FRAMEWORKS = ['react', 'next', 'vue', 'svelte'] as const
export const SUPPORTED_LANGUAGES = ['typescript', 'javascript', 'python'] as const

export const FRAMEWORK_DEFAULTS = {
  react: {
    language: 'typescript',
    setupCommand: 'npm install',
  },
  next: {
    language: 'typescript',
    setupCommand: 'npm install',
  },
  vue: {
    language: 'typescript',
    setupCommand: 'npm install',
  },
  svelte: {
    language: 'typescript',
    setupCommand: 'npm install',
  },
} as const

// Chart Types
export const CHART_TYPES = [
  'bar',
  'line',
  'pie',
  'scatter',
  'area',
] as const

// Slide Layouts
export const SLIDE_LAYOUTS = [
  'title',
  'content',
  'two-column',
] as const

// Color Palette
export const COLORS = {
  primary: '#0066FF',
  secondary: '#00D9FF',
  accent: '#FF6B35',
  darkBg: '#0F1419',
  darkSurface: '#1A1F2E',
  darkSurfaceAlt: '#252D3D',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gray: '#6B7280',
} as const

// Pagination
export const ITEMS_PER_PAGE = 20
export const MAX_ITEMS_PER_PAGE = 100

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = [
  'text/csv',
  'application/json',
  'application/pdf',
  'image/png',
  'image/jpeg',
] as const

// CSV Parser
export const CSV_PARSING_CONFIG = {
  skipEmptyLines: true,
  header: true,
  dynamicTyping: false,
  transformHeader: (header: string) => header.trim(),
} as const

// Session
export const SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
export const SESSION_WARNING_TIME = 60 * 1000 // Warn 1 minute before timeout

// Rate Limiting
export const RATE_LIMITS = {
  api: {
    requests: 100,
    window: 60 * 1000, // 1 minute
  },
  codeGeneration: {
    requests: 10,
    window: 60 * 60 * 1000, // 1 hour
  },
} as const

// Error Messages
export const ERROR_MESSAGES = {
  AUTH_REQUIRED: 'Please sign in to access this feature',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'An account with this email already exists',
  UPLOAD_FAILED: 'File upload failed. Please try again',
  API_ERROR: 'An API error occurred. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  PARSE_ERROR: 'Failed to parse file. Please check the format',
  GENERATION_FAILED: 'Code generation failed. Please try again',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  SETTINGS_SAVED: 'Settings saved successfully',
  PROJECT_CREATED: 'Project created successfully',
  FILE_UPLOADED: 'File uploaded successfully',
  CODE_COPIED: 'Code copied to clipboard',
  EXPORT_STARTED: 'Export started. Download will begin shortly',
} as const

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  CODE_EDITOR: '/editor/code',
  VIZ_EDITOR: '/editor/visualization',
  PRESENTATION_EDITOR: '/editor/presentation',
  SETTINGS: '/settings',
} as const

// Animation Duration
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const

// Breakpoints
export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

// Cache Keys
export const CACHE_KEYS = {
  PROJECTS: 'projects',
  USER_PROFILE: 'user_profile',
  SETTINGS: 'settings',
  CHART_DATA: 'chart_data',
} as const

// Feature Flags
export const FEATURES = {
  REAL_TIME_COLLABORATION: false,
  TEAM_WORKSPACES: false,
  ADVANCED_AI: false,
  API_MARKETPLACE: false,
  MOBILE_APP: false,
} as const

// Version
export const APP_VERSION = '1.0.0'
export const APP_NAME = 'Professional Platform'
