import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0066FF',
        'secondary': '#00D9FF',
        'accent': '#FF6B35',
        'dark-bg': '#0F1419',
        'dark-surface': '#1A1F2E',
        'dark-surface-alt': '#252D3D',
        'light-bg': '#FFFFFF',
        'light-surface': '#F5F5F5',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
