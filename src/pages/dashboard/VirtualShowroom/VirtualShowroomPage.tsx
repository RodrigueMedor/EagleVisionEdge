import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Car,
  Play,
  Pause,
  RotateCw,
  Maximize2,
  Volume2,
  Settings,
  Share2,
  Heart,
  Camera,
  Smartphone,
  Monitor,
  Eye,
  ArrowLeft,
  ArrowRight,
  Grid3x3,
  Download,
  RefreshCw,
  Zap,
  Shield
} from 'lucide-react'
import { virtualShowroomService } from '@/services/virtualShowroomService'
import { 
  VehicleModel, 
  VirtualTour, 
  TourScene, 
  TourHotspot, 
  ARConfiguration,
  ShowroomSession,
  ShowroomInteraction,
  VehicleConfiguration,
  VehicleColor,
  TrimLevel,
  VehicleFeature
} from '@/types/virtualShowroom'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const VirtualShowroomPage: React.FC = () => {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState<VehicleModel[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null)
  const [virtualTour, setVirtualTour] = useState<VirtualTour | null>(null)
  const [arConfig, setArConfig] = useState<ARConfiguration | null>(null)
  const [selectedScene, setSelectedScene] = useState<TourScene | null>(null)
  const [selectedColor, setSelectedColor] = useState<VehicleColor | null>(null)
  const [selectedTrim, setSelectedTrim] = useState<TrimLevel | null>(null)
  const [selectedFeatures, setSelectedFeatures] = useState<VehicleFeature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [showAR, setShowAR] = useState(false)
  const [showHotspots, setShowHotspots] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState(0.5)
  const [arSupported, setArSupported] = useState(false)
  const [session, setSession] = useState<ShowroomSession | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    loadVehicles()
    checkARSupport()
  }, [])

  useEffect(() => {
    if (selectedVehicle) {
      loadVirtualTour(selectedVehicle.id)
      loadARConfiguration(selectedVehicle.id)
      createShowroomSession(selectedVehicle.id)
    }
  }, [selectedVehicle])

  const loadVehicles = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await virtualShowroomService.getVehicles()
      
      if (response.success) {
        setVehicles(response.data)
        if (response.data.length > 0) {
          setSelectedVehicle(response.data[0])
        }
      } else {
        setError(response.message || 'Failed to load vehicles')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const loadVirtualTour = async (vehicleId: string) => {
    try {
      const response = await virtualShowroomService.getVirtualTours(vehicleId)
      
      if (response.success && response.data.length > 0) {
        setVirtualTour(response.data[0])
        setSelectedScene(response.data[0].scenes[0])
        setCurrentSceneIndex(0)
      }
    } catch (err) {
      console.error('Failed to load virtual tour:', err)
    }
  }

  const loadARConfiguration = async (vehicleId: string) => {
    try {
      const response = await virtualShowroomService.getARConfiguration(vehicleId)
      
      if (response.success) {
        setArConfig(response.data)
      }
    } catch (err) {
      console.error('Failed to load AR configuration:', err)
    }
  }

  const checkARSupport = async () => {
    try {
      const response = await virtualShowroomService.checkARSupport()
      
      if (response.success) {
        setArSupported(response.data.supported)
      }
    } catch (err) {
      console.error('Failed to check AR support:', err)
    }
  }

  const createShowroomSession = async (vehicleId: string) => {
    try {
      const response = await virtualShowroomService.createShowroomSession({
        vehicleId,
        configuration: {
          vehicleId,
          totalPrice: 0,
          features: [],
          accessories: []
        },
        arUsed: false,
        startTime: new Date(),
        interactions: [],
        conversionActions: []
      })
      
      if (response.success) {
        setSession(response.data)
      }
    } catch (err) {
      console.error('Failed to create showroom session:', err)
    }
  }

  const handleSceneChange = (scene: TourScene, index: number) => {
    setSelectedScene(scene)
    setCurrentSceneIndex(index)
    
    if (session && virtualTour) {
      const interaction: ShowroomInteraction = {
        id: `interaction_${Date.now()}`,
        timestamp: new Date(),
        type: 'scene_change',
        data: { sceneId: scene.id, sceneName: scene.name }
      }
      
      virtualShowroomService.updateShowroomSession(session.id, {
        interactions: [...session.interactions, interaction]
      })
    }
  }

  const handleHotspotClick = (hotspot: TourHotspot) => {
    if (session) {
      const interaction: ShowroomInteraction = {
        id: `interaction_${Date.now()}`,
        timestamp: new Date(),
        type: 'hotspot_click',
        data: { hotspotId: hotspot.id, title: hotspot.title }
      }
      
      virtualShowroomService.updateShowroomSession(session.id, {
        interactions: [...session.interactions, interaction]
      })
    }

    if (hotspot.action?.type === 'configure' && hotspot.action?.data?.featureId) {
      const featureId = hotspot.action.data?.featureId
      if (featureId) {
        const feature = selectedVehicle?.features.find(f => f.id === featureId)
        if (feature && !selectedFeatures.find(f => f.id === feature.id)) {
          setSelectedFeatures([...selectedFeatures, feature])
        }
      }
    }
  }

  const handleColorChange = (color: VehicleColor) => {
    setSelectedColor(color)
    
    if (session) {
      const interaction: ShowroomInteraction = {
        id: `interaction_${Date.now()}`,
        timestamp: new Date(),
        type: 'color_change',
        data: { colorId: color.id, colorName: color.name }
      }
      
      virtualShowroomService.updateShowroomSession(session.id, {
        interactions: [...session.interactions, interaction]
      })
    }
  }

  const handleTrimChange = (trim: TrimLevel) => {
    setSelectedTrim(trim)
    
    if (session) {
      const interaction: ShowroomInteraction = {
        id: `interaction_${Date.now()}`,
        timestamp: new Date(),
        type: 'trim_change',
        data: { trimId: trim.id, trimName: trim.name }
      }
      
      virtualShowroomService.updateShowroomSession(session.id, {
        interactions: [...session.interactions, interaction]
      })
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleARView = () => {
    if (arSupported && arConfig) {
      setShowAR(true)
      
      if (session) {
        const interaction: ShowroomInteraction = {
          id: `interaction_${Date.now()}`,
          timestamp: new Date(),
          type: 'view_ar',
          data: { arModelUrl: arConfig.modelUrl }
        }
        
        virtualShowroomService.updateShowroomSession(session.id, {
          interactions: [...session.interactions, interaction],
          arUsed: true
        })
      }
    }
  }

  const calculateTotalPrice = () => {
    if (!selectedVehicle) return 0
    
    let totalPrice = selectedTrim?.price || selectedVehicle.trimLevels[0].price
    
    if (selectedColor?.priceAdjustment) {
      totalPrice += selectedColor.priceAdjustment
    }
    
    totalPrice += selectedFeatures.reduce((sum, feature) => sum + feature.price, 0)
    
    return totalPrice
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={loadVehicles}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Virtual Showroom</h1>
            <p className="text-gray-600 mt-1">Experience vehicles in stunning 360° detail with AR</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <RefreshCw size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings size={20} />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Vehicle Selector */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`relative rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                  selectedVehicle?.id === vehicle.id
                    ? 'ring-2 ring-blue-500'
                    : 'border border-gray-200'
                }`}
              >
                <img
                  src={vehicle.images.exterior[0]}
                  alt={vehicle.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <div className="text-white text-sm font-medium">{vehicle.name}</div>
                  <div className="text-white text-xs">${vehicle.price.toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedVehicle && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main 360° View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Scene Navigation */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center space-x-2">
                  {virtualTour?.scenes.map((scene, index) => (
                    <button
                      key={scene.id}
                      onClick={() => handleSceneChange(scene, index)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedScene?.id === scene.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {scene.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowHotspots(!showHotspots)}
                    className={`p-2 rounded-lg ${
                      showHotspots ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-2 rounded-lg ${
                      autoRotate ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <RotateCw size={16} />
                  </button>
                  <button
                    onClick={handleARView}
                    disabled={!arSupported}
                    className={`p-2 rounded-lg ${
                      showAR ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    } ${!arSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Smartphone size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              {/* 360° View Area */}
              <div className="relative bg-gray-900" style={{ height: '500px' }}>
                {selectedScene?.image360 ? (
                  <img
                    src={selectedScene.image360}
                    alt={selectedScene.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-center">
                      <Camera size={48} className="mx-auto mb-4" />
                      <p>360° view not available for this scene</p>
                    </div>
                  </div>
                )}

                {/* Hotspots */}
                {showHotspots && virtualTour?.hotspots
                  .filter(hotspot => hotspot.sceneId === selectedScene?.id)
                  .map((hotspot) => (
                    <button
                      key={hotspot.id}
                      onClick={() => handleHotspotClick(hotspot)}
                      className="absolute bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
                      style={{
                        left: `${hotspot.position.x}%`,
                        top: `${hotspot.position.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <Zap size={16} />
                    </button>
                  ))}

                {/* AR View Overlay */}
                {showAR && arConfig && (
                  <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md">
                      <h3 className="text-lg font-semibold mb-4">AR View</h3>
                      <p className="text-gray-600 mb-4">
                        Point your camera at a flat surface to place {selectedVehicle.name} in your space.
                      </p>
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={() => setShowAR(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                          Exit AR
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                          <Camera size={16} className="mr-2" />
                          Start AR
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Controls */}
                {selectedScene?.videoUrl && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 rounded-lg p-2 flex items-center space-x-2">
                    <button
                      onClick={handlePlayPause}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 text-white"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 text-white">
                      <Volume2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Scene Information */}
              <div className="p-4 border-t">
                <h3 className="text-lg font-semibold mb-2">{selectedScene?.name}</h3>
                <p className="text-gray-600 text-sm">
                  {selectedScene?.type === 'exterior' && 'Explore exterior design and styling details.'}
                  {selectedScene?.type === 'interior' && 'Experience premium interior materials and technology.'}
                  {selectedScene?.type === 'trunk' && 'Check out cargo space and storage capabilities.'}
                  {selectedScene?.type === 'engine' && 'View engine specifications and performance features.'}
                  {selectedScene?.type === 'features' && 'Discover advanced features and technology.'}
                </p>
              </div>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Vehicle Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedVehicle.name}</h2>
              <div className="text-2xl font-bold text-blue-600 mb-4">
                ${calculateTotalPrice().toLocaleString()}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium capitalize">{selectedVehicle.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">{selectedVehicle.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engine:</span>
                  <span className="font-medium">{selectedVehicle.specifications.engine}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transmission:</span>
                  <span className="font-medium">{selectedVehicle.specifications.transmission}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seats:</span>
                  <span className="font-medium">{selectedVehicle.specifications.seats}</span>
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Exterior Color</h3>
              <div className="grid grid-cols-3 gap-3">
                {selectedVehicle.colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all ${
                      selectedColor?.id === color.id
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={color.images[0]}
                      alt={color.name}
                      className="w-full h-20 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1">
                      <div className="text-white text-xs font-medium">{color.name}</div>
                      {color.priceAdjustment && color.priceAdjustment > 0 && (
                        <div className="text-white text-xs">+${color.priceAdjustment}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trim Level Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Trim Level</h3>
              <div className="space-y-3">
                {selectedVehicle.trimLevels.map((trim) => (
                  <button
                    key={trim.id}
                    onClick={() => handleTrimChange(trim)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedTrim?.id === trim.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{trim.name}</span>
                      <span className="font-bold text-lg">${trim.price.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {trim.features.slice(0, 3).map((feature, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {trim.features.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          +{trim.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Features */}
            {selectedFeatures.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Selected Features</h3>
                <div className="space-y-2">
                  {selectedFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-sm text-gray-600">{feature.description}</div>
                      </div>
                      <div className="font-bold text-green-600">+${feature.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                <Heart size={20} className="mr-2" />
                Save Configuration
              </button>
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                <Car size={20} className="mr-2" />
                Schedule Test Drive
              </button>
              <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center">
                <Shield size={20} className="mr-2" />
                Get Financing Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VirtualShowroomPage
