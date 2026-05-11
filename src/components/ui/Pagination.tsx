import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'
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
  maxVisiblePages = 5
}: PaginationProps) {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const pages = []
    const halfVisible = Math.floor(maxVisiblePages / 2)
    
    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)
    
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
    <div className={clsx('flex items-center justify-between', className)}>
      <div className="text-sm text-gray-700">
        Showing page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>
        
        {showPageNumbers && (
          <div className="flex items-center space-x-1">
            {visiblePages[0] > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange(1)}
                  className={clsx(
                    'w-8 h-8 p-0',
                    currentPage === 1 && 'bg-blue-50 text-blue-700 border-blue-200'
                  )}
                >
                  1
                </Button>
                {visiblePages[0] > 2 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
              </>
            )}
            
            {visiblePages.map(page => (
              <Button
                key={page}
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(page)}
                className={clsx(
                  'w-8 h-8 p-0',
                  currentPage === page && 'bg-blue-50 text-blue-700 border-blue-200'
                )}
              >
                {page}
              </Button>
            ))}
            
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPageChange(totalPages)}
                  className={clsx(
                    'w-8 h-8 p-0',
                    currentPage === totalPages && 'bg-blue-50 text-blue-700 border-blue-200'
                  )}
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
