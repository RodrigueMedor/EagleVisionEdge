import { useState, useEffect } from 'react'
import { Car, TrendingUp, Star, ThumbsUp, ThumbsDown, RefreshCw, Filter, DollarSign, Calendar } from 'lucide-react'
import { aiService } from '@/services/aiService'
import { AIRecommendation } from '@/types/ai'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { clsx } from 'clsx'

interface AIRecommendationEngineProps {
  customerId?: string
  recommendationType?: 'vehicle' | 'financing' | 'rental' | 'all'
  className?: string
}

export default function AIRecommendationEngine({ 
  customerId, 
  recommendationType = 'all',
  className 
}: AIRecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [filteredRecommendations, setFilteredRecommendations] = useState<AIRecommendation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('confidence')
  const [userFeedback, setUserFeedback] = useState<Record<string, 'like' | 'dislike'>>({})

  const categories = [
    { value: 'all', label: 'All Recommendations' },
    { value: 'vehicle', label: 'Vehicles' },
    { value: 'financing', label: 'Financing' },
    { value: 'rental', label: 'Rentals' }
  ]

  const sortOptions = [
    { value: 'confidence', label: 'Best Match' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' }
  ]

  useEffect(() => {
    loadRecommendations()
  }, [recommendationType, customerId])

  useEffect(() => {
    filterAndSortRecommendations()
  }, [recommendations, selectedCategory, sortBy])

  const loadRecommendations = async () => {
    setIsLoading(true)
    try {
      const allRecommendations: AIRecommendation[] = []

      // Load vehicle recommendations
      if (recommendationType === 'all' || recommendationType === 'vehicle') {
        const vehicleResponse = await aiService.getVehicleRecommendations()
        if (vehicleResponse.success && vehicleResponse.data) {
          allRecommendations.push(...vehicleResponse.data)
        }
      }

      // Load financing recommendations
      if (recommendationType === 'all' || recommendationType === 'financing') {
        const financingResponse = await aiService.getFinancingRecommendations()
        if (financingResponse.success && financingResponse.data) {
          allRecommendations.push(...financingResponse.data)
        }
      }

      // Add some mock rental recommendations
      if (recommendationType === 'all' || recommendationType === 'rental') {
        const mockRentals: AIRecommendation[] = [
          {
            id: 'rental-rec-1',
            title: 'Weekly SUV Rental Special',
            description: 'Perfect for family trips with unlimited mileage and full coverage',
            type: 'rental',
            score: 8.5,
            confidence: 0.85,
            metadata: {
              price: 450,
              duration: 'weekly',
              category: 'suv',
              available: true,
              features: ['GPS', 'Child Seats', 'Insurance']
            },
            createdAt: new Date()
          },
          {
            id: 'rental-rec-2',
            title: 'Cargo Van Monthly Rate',
            description: 'Ideal for business use with loading ramp and unlimited mileage',
            type: 'rental',
            score: 7.8,
            confidence: 0.78,
            metadata: {
              price: 1200,
              duration: 'monthly',
              category: 'cargo_van',
              available: true,
              features: ['Loading Ramp', 'Insurance', '24/7 Support']
            },
            createdAt: new Date()
          }
        ]
        allRecommendations.push(...mockRentals)
      }

      setRecommendations(allRecommendations)
    } catch (error) {
      console.error('Failed to load recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterAndSortRecommendations = () => {
    let filtered = recommendations

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(rec => rec.type === selectedCategory)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return (b.confidence || 0) - (a.confidence || 0)
        case 'price_low':
          return (a.metadata?.price || 0) - (b.metadata?.price || 0)
        case 'price_high':
          return (b.metadata?.price || 0) - (a.metadata?.price || 0)
        case 'newest':
          return b.id.localeCompare(a.id) // Simple ID-based sorting
        default:
          return 0
      }
    })

    setFilteredRecommendations(filtered)
  }

  const handleFeedback = (recommendationId: string, feedback: 'like' | 'dislike') => {
    setUserFeedback(prev => ({ ...prev, [recommendationId]: feedback }))
    
    // In a real app, this would send feedback to the AI service
    console.log(`User feedback: ${feedback} for recommendation ${recommendationId}`)
  }

  const refreshRecommendations = () => {
    loadRecommendations()
    setUserFeedback({})
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'vehicle':
        return '🚗'
      case 'financing':
        return '💰'
      case 'rental':
        return '🔑'
      default:
        return '⭐'
    }
  }

  const getRecommendationColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <Card className={clsx("p-6", className)}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Recommendations</h3>
            <p className="text-sm text-gray-600">Personalized suggestions based on your preferences</p>
          </div>
          <Button
            variant="secondary"
            onClick={refreshRecommendations}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={clsx("w-4 h-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex-1">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full"
            >
              {sortOptions.map((sort) => (
                <option key={sort.value} value={sort.value}>
                  {sort.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Generating personalized recommendations...</p>
          </div>
        )}

        {/* Recommendations */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No recommendations available</h4>
                <p className="text-gray-600">Check back later for personalized suggestions</p>
              </div>
            ) : (
              filteredRecommendations.map((recommendation) => (
                <div
                  key={recommendation.id}
                  className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getRecommendationIcon(recommendation.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={clsx(
                            "text-sm font-medium",
                            getRecommendationColor(recommendation.confidence || 0)
                          )}>
                            {Math.round((recommendation.confidence || 0) * 100)}% match
                          </span>
                          <span className="text-xs text-gray-500 capitalize">
                            {recommendation.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    {recommendation.metadata?.recommended && (
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        Recommended
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{recommendation.description}</p>

                  {/* Metadata */}
                  {recommendation.metadata && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      {recommendation.metadata.price && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium">{formatCurrency(recommendation.metadata.price)}</span>
                        </div>
                      )}
                      {recommendation.metadata.duration && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium capitalize">{recommendation.metadata.duration}</span>
                        </div>
                      )}
                      {recommendation.metadata.category && (
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium capitalize">{recommendation.metadata.category}</span>
                        </div>
                      )}
                      {recommendation.metadata.available !== undefined && (
                        <div className="flex items-center gap-2">
                          <div className={clsx(
                            "w-2 h-2 rounded-full",
                            recommendation.metadata.available ? "bg-green-500" : "bg-red-500"
                          )}></div>
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium">
                            {recommendation.metadata.available ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Features */}
                  {recommendation.metadata?.features && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {recommendation.metadata.features.slice(0, 3).map((feature: string, index: number) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                        {(recommendation.metadata.features.length || 0) > 3 && (
                          <span className="text-xs text-gray-500">
                            +{(recommendation.metadata.features.length || 0) - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm">
                        View Details
                      </Button>
                      <Button variant="secondary" size="sm">
                        Save
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(recommendation.id, 'like')}
                        className={clsx(
                          userFeedback[recommendation.id] === 'like' && "text-green-600"
                        )}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeedback(recommendation.id, 'dislike')}
                        className={clsx(
                          userFeedback[recommendation.id] === 'dislike' && "text-red-600"
                        )}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Summary Stats */}
        {!isLoading && filteredRecommendations.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{filteredRecommendations.length}</p>
                <p className="text-sm text-gray-600">Total Recommendations</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {filteredRecommendations.filter(r => (r.confidence || 0) >= 0.8).length}
                </p>
                <p className="text-sm text-gray-600">High Confidence</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {filteredRecommendations.filter(r => r.metadata?.available).length}
                </p>
                <p className="text-sm text-gray-600">Currently Available</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {Object.keys(userFeedback).length}
                </p>
                <p className="text-sm text-gray-600">Your Feedback</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
