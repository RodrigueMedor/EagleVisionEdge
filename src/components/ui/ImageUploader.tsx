import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
  aspectRatio?: string
}

export default function ImageUploader({ value, onChange, label, aspectRatio = '16/9' }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return
    setLoading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      onChange(e.target?.result as string)
      setLoading(false)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleClick = () => inputRef.current?.click()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden ${
          dragging
            ? 'border-accent bg-accent/5'
            : value
              ? 'border-gray-200 bg-gray-50'
              : 'border-gray-300 hover:border-accent hover:bg-gray-50'
        }`}
        style={{ aspectRatio }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />

        {value ? (
          <div className="relative w-full h-full group">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <span className="text-xs text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  Click to change
                </span>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload size={18} className="text-gray-400" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Drag & drop or <span className="text-accent">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP up to 5MB</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
