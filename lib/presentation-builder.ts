import { Slide, PresentationTheme } from '@/lib/types'

export function createBlankSlide(title: string = 'Untitled'): Slide {
  return {
    id: Date.now().toString(),
    title,
    content: '',
    layout: 'title-content',
    bgColor: '#ffffff',
    textColor: '#000000',
  }
}

export function createTitleSlide(title: string, subtitle: string = ''): Slide {
  return {
    id: Date.now().toString(),
    title,
    content: subtitle,
    layout: 'title-slide',
    bgColor: '#1a1a1a',
    textColor: '#ffffff',
  }
}

export function createTwoColumnSlide(title: string, leftContent: string = '', rightContent: string = ''): Slide {
  return {
    id: Date.now().toString(),
    title,
    content: JSON.stringify({ left: leftContent, right: rightContent }),
    layout: 'two-column',
    bgColor: '#ffffff',
    textColor: '#000000',
  }
}

export const defaultThemes: Record<string, PresentationTheme> = {
  light: {
    name: 'Light',
    primaryColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#f59e0b',
  },
  dark: {
    name: 'Dark',
    primaryColor: '#60a5fa',
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    accentColor: '#fbbf24',
  },
  professional: {
    name: 'Professional',
    primaryColor: '#1e40af',
    backgroundColor: '#f8fafc',
    textColor: '#1e293b',
    accentColor: '#0891b2',
  },
  vibrant: {
    name: 'Vibrant',
    primaryColor: '#dc2626',
    backgroundColor: '#fef2f2',
    textColor: '#7f1d1d',
    accentColor: '#fbbf24',
  },
}

export function exportToJSON(slides: Slide[], theme: PresentationTheme): string {
  return JSON.stringify(
    {
      slides,
      theme,
      createdAt: new Date().toISOString(),
      version: '1.0',
    },
    null,
    2
  )
}
