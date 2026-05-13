import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to system
    const saved = localStorage.getItem('theme') as Theme
    return saved || 'system'
  })

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const updateResolvedTheme = () => {
      let resolved: 'light' | 'dark'
      
      if (theme === 'system') {
        resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } else {
        resolved = theme
      }
      
      setResolvedTheme(resolved)
      
      // Apply theme to document
      console.log('Applying theme:', resolved, 'to document')
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark')
        console.log('Added dark class to document')
      } else {
        document.documentElement.classList.remove('dark')
        console.log('Removed dark class from document')
      }
      console.log('Document classes:', document.documentElement.classList.toString())
    }

    updateResolvedTheme()

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', updateResolvedTheme)
      
      return () => {
        mediaQuery.removeEventListener('change', updateResolvedTheme)
      }
    }
  }, [theme])

  const handleSetTheme = (newTheme: Theme) => {
    console.log('Setting theme to:', newTheme)
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const value = {
    theme,
    setTheme: handleSetTheme,
    resolvedTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
