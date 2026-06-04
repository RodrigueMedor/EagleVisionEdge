import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RotateCw,
  Maximize2,
  Settings,
  Share2,
  Heart,
  Camera,
  Smartphone,
  Eye,
  RefreshCw,
  Zap,
  ChevronLeft,
  ChevronRight,
  X,
  DollarSign,
  Calendar,
  CheckCircle2,
  Palette,
  Layers,
  Sparkles
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
  VehicleColor,
  TrimLevel,
  VehicleFeature
} from '@/types/virtualShowroom'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

const VEHICLE_IMAGES: Record<string, { exterior: string[]; interior: string[] }> = {
  vehicle_1: {
    exterior: [
      'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1554744511-65e1a7a3cdd9?w=800&h=600&fit=crop'
    ],
    interior: [
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1557745576-b7b704b6a8a3?w=800&h=600&fit=crop'
    ]
  },
  vehicle_2: {
    exterior: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=800&h=600&fit=crop'
    ],
    interior: [
      'https://images.unsplash.com/photo-1581540331544-89cdef2da543?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&h=600&fit=crop'
    ]
  }
}

const COLOR_IMAGES: Record<string, string> = {
  color_1: 'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?w=400&h=300&fit=crop',
  color_2: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
  color_3: 'https://images.unsplash.com/photo-1554744511-65e1a7a3cdd9?w=400&h=300&fit=crop',
  color_bmw_1: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
  color_bmw_2: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=400&h=300&fit=crop'
}

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
  const [switchingVehicle, setSwitchingVehicle] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [showAR, setShowAR] = useState(false)
  const [showHotspots, setShowHotspots] = useState(true)
  const [autoRotate, setAutoRotate] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState(0.5)
  const [arSupported, setArSupported] = useState(false)
  const [session, setSession] = useState<ShowroomSession | null>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showSettingsPanel, setShowSettingsPanel] = useState(false)
  const [showSavedToast, setShowSavedToast] = useState(false)

  const vehicleImages = selectedVehicle ? VEHICLE_IMAGES[selectedVehicle.id] : null
  const currentSceneImages = selectedScene?.type === 'interior' ? vehicleImages?.interior : vehicleImages?.exterior

  useEffect(() => {
    loadVehicles()
    checkARSupport()
  }, [])

  useEffect(() => {
    if (selectedVehicle) {
      setSwitchingVehicle(true)
      setActiveImageIndex(0)
      loadVirtualTour(selectedVehicle.id)
      loadARConfiguration(selectedVehicle.id)
      createShowroomSession(selectedVehicle.id)
    }
  }, [selectedVehicle])

  useEffect(() => {
    if (virtualTour) {
      setSwitchingVehicle(false)
    }
  }, [virtualTour])

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
    } catch {
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
    } catch {
      /* silently fail */
    }
  }

  const loadARConfiguration = async (vehicleId: string) => {
    try {
      const response = await virtualShowroomService.getARConfiguration(vehicleId)
      if (response.success) {
        setArConfig(response.data)
      }
    } catch {
      /* silently fail */
    }
  }

  const checkARSupport = async () => {
    try {
      const response = await virtualShowroomService.checkARSupport()
      if (response.success) {
        setArSupported(response.data.supported)
      }
    } catch {
      /* silently fail */
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
    } catch {
      /* silently fail */
    }
  }

  const handleSceneChange = (scene: TourScene, index: number) => {
    setSelectedScene(scene)
    setCurrentSceneIndex(index)
    setActiveImageIndex(0)
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
      const featureId = hotspot.action.data.featureId
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

  const handleSaveConfiguration = () => {
    if (!selectedVehicle) return
    const config = {
      vehicleId: selectedVehicle.id,
      vehicleName: selectedVehicle.name,
      color: selectedColor?.name || selectedVehicle.colors[0]?.name,
      trim: selectedTrim?.name || selectedVehicle.trimLevels[0]?.name,
      features: selectedFeatures.map(f => f.name),
      totalPrice: calculateTotalPrice(),
      savedAt: new Date().toISOString()
    }
    const existing = JSON.parse(localStorage.getItem('savedShowroomConfigs') || '[]')
    existing.push(config)
    localStorage.setItem('savedShowroomConfigs', JSON.stringify(existing))
    setShowSavedToast(true)
    setTimeout(() => setShowSavedToast(false), 3000)
  }

  const calculateTotalPrice = () => {
    if (!selectedVehicle) return 0
    let total = selectedTrim?.price || selectedVehicle.trimLevels[0].price
    if (selectedColor?.priceAdjustment) total += selectedColor.priceAdjustment
    total += selectedFeatures.reduce((sum, feature) => sum + feature.price, 0)
    return total
  }

  const hotspotPosition = (hotspot: TourHotspot) => {
    const x = Math.max(10, Math.min(90, ((hotspot.position.x + 5) / 10) * 80 + 10))
    const y = Math.max(10, Math.min(90, ((hotspot.position.z + 5) / 10) * 80 + 10))
    return { left: `${x}%`, top: `${y}%` }
  }

  const switchImage = (direction: 'prev' | 'next') => {
    if (!currentSceneImages?.length) return
    if (direction === 'prev') {
      setActiveImageIndex(prev => (prev === 0 ? currentSceneImages.length - 1 : prev - 1))
    } else {
      setActiveImageIndex(prev => (prev === currentSceneImages.length - 1 ? 0 : prev + 1))
    }
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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="card p-8 text-center max-w-md">
          <div className="text-red-500 mb-4 text-lg">{error}</div>
          <button onClick={loadVehicles} className="btn-primary px-6 py-2">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Virtual Showroom</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Explore vehicles in stunning 360° detail</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => loadVehicles()}
              className="btn-ghost p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Refresh"
            >
              <RefreshCw size={20} />
            </button>
            <button
              onClick={() => setShowSettingsPanel(!showSettingsPanel)}
              className="btn-ghost p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Settings"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href)
              }}
              className="btn-ghost p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              title="Share"
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {showSettingsPanel && (
          <div className="card p-4 mb-6 animate-fadeInUp">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Showroom Settings</h3>
              <button onClick={() => setShowSettingsPanel(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={autoRotate} onChange={e => setAutoRotate(e.target.checked)} className="rounded border-gray-300" />
                <span className="text-sm">Auto-rotate view</span>
              </label>
              <label className="flex items-center space-x-3">
                <input type="checkbox" checked={showHotspots} onChange={e => setShowHotspots(e.target.checked)} className="rounded border-gray-300" />
                <span className="text-sm">Show hotspots</span>
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-sm whitespace-nowrap">Rotation speed:</span>
                <input type="range" min="0.1" max="1" step="0.1" value={rotationSpeed} onChange={e => setRotationSpeed(Number(e.target.value))} className="flex-1" />
              </div>
            </div>
          </div>
        )}

        <div className="card p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {vehicles.map(vehicle => (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className={`relative rounded-xl overflow-hidden transition-all ${
                  selectedVehicle?.id === vehicle.id
                    ? 'ring-2 ring-accent shadow-glow'
                    : 'border border-gray-200 dark:border-gray-700 hover:shadow-soft'
                }`}
              >
                <img
                  src={VEHICLE_IMAGES[vehicle.id]?.exterior[0] || vehicle.images.exterior[0]}
                  alt={vehicle.name}
                  className="w-full h-32 object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="text-white text-sm font-medium">{vehicle.name}</div>
                  <div className="text-white/80 text-xs">${vehicle.price.toLocaleString()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedVehicle && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {(virtualTour?.scenes || ['exterior', 'interior', 'trunk', 'engine'].map((t, i) => ({
                    id: `${t}_${i}`, name: t.charAt(0).toUpperCase() + t.slice(1), type: t as any
                  }))).map((scene, index) => (
                    <button
                      key={scene.id}
                      onClick={() => {
                        const s = virtualTour?.scenes[index]
                        if (s) handleSceneChange(s, index)
                        else { setCurrentSceneIndex(index); setSelectedScene(null); setActiveImageIndex(0) }
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                        (selectedScene?.id === scene.id) || (!selectedScene && currentSceneIndex === index && scene.type === 'exterior')
                          ? 'bg-accent text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {scene.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowHotspots(!showHotspots)}
                    className={`p-2 rounded-lg ${showHotspots ? 'bg-accent/10 text-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                    title="Toggle hotspots"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`p-2 rounded-lg ${autoRotate ? 'bg-accent/10 text-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                    title="Auto-rotate"
                  >
                    <RotateCw size={16} className={autoRotate ? 'animate-spin-slow' : ''} />
                  </button>
                  <button
                    onClick={() => arSupported ? setShowAR(true) : null}
                    disabled={!arSupported}
                    className={`p-2 rounded-lg ${showAR ? 'bg-accent/10 text-accent' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'} ${!arSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="AR View"
                  >
                    <Smartphone size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600" title="Fullscreen">
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>

              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" style={{ height: '500px' }}>
                {switchingVehicle ? (
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : currentSceneImages?.length ? (
                  <>
                    <img
                      src={currentSceneImages[activeImageIndex]}
                      alt={selectedScene?.name || 'Vehicle view'}
                      className="w-full h-full object-contain transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    {currentSceneImages.length > 1 && (
                      <>
                        <button
                          onClick={() => switchImage('prev')}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() => switchImage('next')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all"
                        >
                          <ChevronRight size={20} />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                          {currentSceneImages.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImageIndex(i)}
                              className={`w-2 h-2 rounded-full transition-all ${i === activeImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-gray-400 text-center">
                      <Camera size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">View not available</p>
                      <p className="text-sm mt-1">Select a different scene to explore</p>
                    </div>
                  </div>
                )}

                {showHotspots && virtualTour?.hotspots
                  .filter(hotspot => hotspot.sceneId === selectedScene?.id)
                  .map(hotspot => (
                    <button
                      key={hotspot.id}
                      onClick={() => handleHotspotClick(hotspot)}
                      className="absolute p-2 bg-accent text-white rounded-full hover:bg-accent/90 transition-all hover:scale-110 shadow-glow"
                      style={hotspotPosition(hotspot)}
                      title={hotspot.title}
                    >
                      <Zap size={16} />
                    </button>
                  ))}

                {showAR && arConfig && (
                  <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-10">
                    <div className="card p-8 max-w-md text-center">
                      <Smartphone size={48} className="mx-auto mb-4 text-accent" />
                      <h3 className="text-xl font-bold mb-2">AR View</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Point your camera at a flat surface to place <strong>{selectedVehicle.name}</strong> in your space.
                      </p>
                      <div className="flex items-center justify-center space-x-4">
                        <button
                          onClick={() => setShowAR(false)}
                          className="btn-ghost px-4 py-2 rounded-xl"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => {
                            setShowAR(false)
                          }}
                          className="btn-primary px-6 py-2 rounded-xl"
                        >
                          <Camera size={16} className="mr-2" />
                          Launch AR
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedScene?.name || 'Vehicle View'}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {currentSceneImages && activeImageIndex + 1} of {currentSceneImages?.length || 0}
                      {currentSceneImages?.length ? ' images' : ''}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 capitalize">
                    {selectedScene?.type || 'exterior'} view
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-1">{selectedVehicle.name}</h2>
              <div className="text-2xl font-bold text-accent mb-4">
                ${calculateTotalPrice().toLocaleString()}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium capitalize">{selectedVehicle.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Year</span>
                  <span className="font-medium">{selectedVehicle.year}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Engine</span>
                  <span className="font-medium">{selectedVehicle.specifications.engine}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-500">Transmission</span>
                  <span className="font-medium">{selectedVehicle.specifications.transmission}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Seats</span>
                  <span className="font-medium">{selectedVehicle.specifications.seats}</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette size={18} className="text-accent" />
                <h3 className="font-semibold">Exterior Color</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {selectedVehicle.colors.map(color => (
                  <button
                    key={color.id}
                    onClick={() => handleColorChange(color)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      selectedColor?.id === color.id
                        ? 'border-accent shadow-soft'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <img src={COLOR_IMAGES[color.id] || color.images[0]} alt={color.name} className="w-full h-20 object-cover" loading="lazy" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                      <div className="text-white text-xs font-medium truncate">{color.name}</div>
                      {color.priceAdjustment ? <div className="text-white/80 text-xs">+${color.priceAdjustment}</div> : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Layers size={18} className="text-accent" />
                <h3 className="font-semibold">Trim Level</h3>
              </div>
              <div className="space-y-3">
                {selectedVehicle.trimLevels.map(trim => (
                  <button
                    key={trim.id}
                    onClick={() => handleTrimChange(trim)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedTrim?.id === trim.id
                        ? 'border-accent bg-accent/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{trim.name}</span>
                      <span className="font-bold text-lg">${trim.price.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {trim.features.slice(0, 3).map((feature, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                          {feature}
                        </span>
                      ))}
                      {trim.features.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                          +{trim.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedFeatures.length > 0 && (
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Sparkles size={18} className="text-accent" />
                  <h3 className="font-semibold">Selected Features</h3>
                </div>
                <div className="space-y-2">
                  {selectedFeatures.map(feature => (
                    <div key={feature.id} className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div>
                        <div className="font-medium text-sm">{feature.name}</div>
                        <div className="text-xs text-gray-500">{feature.description}</div>
                      </div>
                      <div className="font-bold text-green-600 text-sm">+${feature.price.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleSaveConfiguration}
                className="w-full px-4 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 flex items-center justify-center font-medium transition-all hover:shadow-soft"
              >
                <Heart size={20} className="mr-2" />
                Save Configuration
              </button>
              <button
                onClick={() => navigate('/schedule-demo')}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center font-medium transition-all hover:shadow-soft"
              >
                <Calendar size={20} className="mr-2" />
                Schedule Test Drive
              </button>
              <button
                onClick={() => navigate('/financing')}
                className="w-full px-4 py-3 bg-gold text-white rounded-xl hover:bg-gold/90 flex items-center justify-center font-medium transition-all hover:shadow-soft"
              >
                <DollarSign size={20} className="mr-2" />
                Get Financing Quote
              </button>
            </div>
          </div>
        </div>
      )}

      {showSavedToast && (
        <div className="fixed bottom-6 right-6 card p-4 flex items-center space-x-3 shadow-xl animate-fadeInUp z-50 border border-green-200 dark:border-green-800">
          <CheckCircle2 size={20} className="text-green-500" />
          <span className="font-medium">Configuration saved!</span>
        </div>
      )}
    </div>
  )
}

export default VirtualShowroomPage
