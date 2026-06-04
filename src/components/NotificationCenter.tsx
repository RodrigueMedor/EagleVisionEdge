import { useState, useEffect } from 'react'
import { Bell, X, Check, Trash2 } from 'lucide-react'
import { Notification } from '@/types/notifications'
import { SearchFilterBar } from '@/components/ui/SearchFilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { EmptyState } from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

interface NotificationCenterProps {
  notifications: Notification[]
  isOpen: boolean
  onClose: () => void
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onMarkAllAsRead: () => void
  onClearAll: () => void
}

export function NotificationCenter({ 
  notifications, 
  isOpen, 
  onClose, 
  onMarkAsRead, 
  onDelete, 
  onMarkAllAsRead, 
  onClearAll 
}: NotificationCenterProps) {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    read: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const filteredNotifications = notifications.filter(notification => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      if (!notification.title.toLowerCase().includes(searchLower) &&
          !notification.message.toLowerCase().includes(searchLower)) {
        return false
      }
    }

    // Type filter
    if (filters.type && filters.type !== 'all') {
      if (notification.type !== filters.type) {
        return false
      }
    }

    // Read status filter
    if (filters.read) {
      if (filters.read === 'read' && !notification.read) {
        return false
      }
      if (filters.read === 'unread' && notification.read) {
        return false
      }
    }

    return true
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage)
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const unreadCount = notifications.filter(n => !n.read).length

  const getEntityIcon = (entityType?: string) => {
    switch (entityType) {
      case 'lead':
        return '👤'
      case 'vehicle':
        return '🚗'
      case 'customer':
        return '👥'
      case 'financing':
        return '📊'
      case 'rental':
        return '📅'
      default:
        return '📢'
    }
  }

  const getEntityColor = (entityType?: string) => {
    switch (entityType) {
      case 'lead':
        return 'bg-blue-100 text-blue-800'
      case 'vehicle':
        return 'bg-green-100 text-green-800'
      case 'customer':
        return 'bg-purple-100 text-purple-800'
      case 'rental':
        return 'bg-orange-100 text-orange-800'
      case 'financing':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return dateObj.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
              <Check className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <SearchFilterBar
            searchValue={filters.search}
            onSearchChange={(value) => setFilters({ ...filters, search: value })}
            filters={{
              type: filters.type,
              read: filters.read
            }}
            onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
            placeholder="Search notifications..."
            showFilters={false}
          />
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {paginatedNotifications.length === 0 ? (
            <EmptyState
              type="general"
              title="No notifications"
              description={filteredNotifications.length === 0 ? 
                "No notifications match your current filters." :
                "You're all caught up!"
              }
              action={filteredNotifications.length === 0 ? (
                <Button variant="secondary" onClick={() => setFilters({ search: '', type: '', read: '' })}>
                  Clear Filters
                </Button>
              ) : null}
            />
          ) : (
            <div className="divide-y divide-gray-200">
              {paginatedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getEntityColor(notification.entityType)}`}>
                      {getEntityIcon(notification.entityType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                            {notification.actionUrl && (
                              <Button variant="ghost" size="sm" className="text-xs">
                                View
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete(notification.id)
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {paginatedNotifications.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

interface NotificationButtonProps {
  notifications: Notification[]
  onToggle: () => void
}

export function NotificationButton({ notifications, onToggle }: NotificationButtonProps) {
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="relative"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Button>
  )
}
