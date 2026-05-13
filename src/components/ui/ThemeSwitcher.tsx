import React, { useState } from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  const CurrentIcon = theme === 'system' ? Monitor : resolvedTheme === 'dark' ? Moon : Sun

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        title="Change theme"
      >
        <CurrentIcon size={20} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
            <div className="p-2">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon
                const isActive = theme === themeOption.value
                
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value)
                      setIsOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{themeOption.label}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full ml-auto" />
                    )}
                  </button>
                )
              })}
            </div>
            
            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Current: {theme.charAt(0).toUpperCase() + theme.slice(1)}
                {theme === 'system' && ` (${resolvedTheme})`}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
