import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { ModalProps } from '@/types/financing'

export default function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      if (modalRef.current) {
        modalRef.current.focus()
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }[size || 'md']

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 animate-fadeIn"
        onClick={handleBackdropClick}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          className={`bg-white rounded-2xl shadow-2xl w-full ${sizeClass} transform transition-all duration-300 animate-scaleIn max-h-[90vh] flex flex-col`}
        >
          {title && (
            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100 flex-shrink-0">
              <h2 id="modal-title" className="text-lg sm:text-xl font-bold text-primary">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-xl hover:bg-gray-100 flex-shrink-0"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className={`p-5 sm:p-6 overflow-y-auto flex-1 ${!title ? 'pt-8' : ''}`}>
            {children}
          </div>

          {footer && (
            <div className="p-5 sm:p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3 flex-shrink-0">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
