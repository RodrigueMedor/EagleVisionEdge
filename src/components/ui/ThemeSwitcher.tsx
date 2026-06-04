import { useState } from 'react'
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
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
      >
        <CurrentIcon size={18} />
        <span>Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 bottom-full mb-2 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl z-20 overflow-hidden">
            <div className="p-1.5 space-y-0.5">
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isActive
                        ? 'bg-gold/10 text-gold font-medium'
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className={`${isActive ? 'text-gold' : 'text-gray-400'}`}>
                      <Icon size={16} />
                    </div>
                    <span>{themeOption.label}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 bg-gold rounded-full ml-auto" />
                    )}
                  </button>
                )
              })}
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2">
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
