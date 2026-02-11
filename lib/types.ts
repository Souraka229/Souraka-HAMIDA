/**
 * Shared TypeScript types and interfaces
 */

// User Types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  avatarUrl?: string
  company?: string
  role?: string
  preferences?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// Project Types
export type ProjectType = 'code' | 'visualization' | 'presentation'
export type ProjectStatus = 'draft' | 'active' | 'archived'

export interface Project {
  id: string
  userId: string
  name: string
  description?: string
  type: ProjectType
  status: ProjectStatus
  createdAt: Date
  updatedAt: Date
  metadata?: Record<string, any>
}

// Code Generation Types
export interface CodeGenerationRequest {
  prompt: string
  framework?: string
  language?: string
  context?: string
}

export interface CodeGenerationResponse {
  code: string
  language: string
  framework: string
  dependencies?: string[]
  installCommand?: string
  usageExample?: string
}

export interface CodeGeneration {
  id: string
  userId: string
  projectId: string
  prompt: string
  generatedCode: string
  language: string
  framework: string
  qualityScore?: number
  createdAt: Date
  updatedAt: Date
}

// Data Source Types
export type DataSourceType = 'csv' | 'json' | 'sql' | 'api'

export interface DataSource {
  id: string
  userId: string
  projectId?: string
  name: string
  type: DataSourceType
  sourceData: Record<string, any>
  configuration?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface CSVData {
  columns: string[]
  data: Record<string, any>[]
  filename: string
}

export interface JSONData {
  columns: string[]
  data: Record<string, any>[]
  filename: string
}

// Visualization Types
export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'area'

export interface ChartConfig {
  type: ChartType
  title: string
  xAxis?: string
  yAxis?: string
  color?: string
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  animated?: boolean
  responsive?: boolean
}

export interface Visualization {
  id: string
  userId: string
  projectId: string
  dataSourceId?: string
  name: string
  type: ChartType
  configuration: ChartConfig
  createdAt: Date
  updatedAt: Date
}

// Presentation Types
export type SlideLayout = 'title' | 'content' | 'two-column'

export interface Slide {
  id: string
  title: string
  subtitle?: string
  content: string
  layout: SlideLayout
  backgroundColor?: string
  image?: string
  notes?: string
}

export interface Presentation {
  id: string
  userId: string
  projectId: string
  title: string
  description?: string
  slides: Slide[]
  theme?: string
  status: ProjectStatus
  createdAt: Date
  updatedAt: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

// Settings Types
export interface UserSettings {
  theme: 'dark' | 'light' | 'auto'
  notifications: boolean
  autoSave: boolean
  codeFormat: 'typescript' | 'javascript' | 'python'
  defaultFramework?: string
  language?: string
}

// Pagination Types
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// User Interaction Types (for analytics)
export interface UserInteraction {
  id: string
  userId: string
  interactionType: string
  targetId?: string
  targetType?: string
  metadata?: Record<string, any>
  createdAt: Date
}

// API Connection Types
export type AuthType = 'bearer' | 'api_key' | 'oauth'

export interface APIConnection {
  id: string
  userId: string
  name: string
  apiType: string
  baseUrl: string
  authType: AuthType
  credentials: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  id?: string
  'aria-label'?: string
}

export interface ButtonProps extends BaseComponentProps {
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

// Utility Types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Either<T, U> = T | U

export type AsyncFunction<T = void> = () => Promise<T>
export type SyncFunction<T = void> = () => T
export type Callback<T = void> = (data: T) => void
