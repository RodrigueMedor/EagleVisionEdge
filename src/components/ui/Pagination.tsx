import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showPageNumbers?: boolean
  maxVisiblePages?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showPageNumbers = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - halfVisible)
    const end = Math.min(totalPages, start + maxVisiblePages - 1)
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={clsx('flex flex-col sm:flex-row items-center justify-between gap-4', className)}>
      <div className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {showPageNumbers && (
          <div className="flex items-center gap-1">
            {visiblePages[0] > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="w-9 h-9 rounded-xl text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 border border-gray-200 transition-all"
                >
                  1
                </button>
                {visiblePages[0] > 2 && <span className="px-1 text-gray-400 text-sm">...</span>}
              </>
            )}
            {visiblePages.map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={clsx(
                  'w-9 h-9 rounded-xl text-sm font-medium transition-all',
                  currentPage === page
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50 border border-gray-200'
                )}
              >
                {page}
              </button>
            ))}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="px-1 text-gray-400 text-sm">...</span>
                )}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="w-9 h-9 rounded-xl text-sm font-medium text-gray-600 hover:text-primary hover:bg-gray-50 border border-gray-200 transition-all"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
