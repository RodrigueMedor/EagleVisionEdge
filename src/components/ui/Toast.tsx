import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { ToastNotification } from '@/types/financing'

interface ToastProps {
  toast: ToastNotification
  onClose: (id: string) => void
}

export default function Toast({ toast, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(toast.id), 300)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  }

  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className={`
        ${backgrounds[toast.type]}
        border rounded-lg shadow-lg p-4 flex items-start gap-3
      `}>
        {icons[toast.type]}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">
            {toast.title}
          </h4>
          <p className="text-sm text-gray-700 break-words">
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(toast.id), 300)
          }}
          className="flex-shrink-0 p-1 rounded-md hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastNotification[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast toast={toast} onClose={onClose} />
        </div>
      ))}
    </div>
  )
}
