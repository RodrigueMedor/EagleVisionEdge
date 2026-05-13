import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  X,
  Maximize2,
  RotateCw,
  Move3d,
  ZoomIn,
  ZoomOut,
  Camera,
  Download,
  Share2,
  Smartphone,
  Monitor,
  Box
} from 'lucide-react'
import { ARConfiguration, ARMarker } from '@/types/virtualShowroom'

interface ARVehicleViewerProps {
  configuration: ARConfiguration
  onClose: () => void
  onInteraction?: (type: string, data: any) => void
}

const ARVehicleViewer: React.FC<ARVehicleViewerProps> = ({
  configuration,
  onClose,
  onInteraction
}) => {
  const [isARMode, setIsARMode] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [scale, setScale] = useState(configuration.scale)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [selectedMarker, setSelectedMarker] = useState<ARMarker | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [autoRotate, setAutoRotate] = useState(configuration.autoRotate)
  const [arSupported, setArSupported] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const modelRef = useRef<any>(null)

  // Check AR support
  useEffect(() => {
    const checkARSupport = async () => {
      if ('xr' in navigator) {
        try {
          const isSupported = await (navigator as any).xr.isSessionSupported('immersive-ar')
          setArSupported(isSupported)
        } catch (err) {
          console.error('AR support check failed:', err)
          setArSupported(false)
        }
      } else {
        setArSupported(false)
      }
    }
    
    checkARSupport()
  }, [])

  // Initialize 3D scene
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl')
    
    if (!ctx) {
      console.error('WebGL not supported')
      setIsLoading(false)
      return
    }

    // Initialize Three.js scene (simplified for demo)
    initializeScene()
    
    setIsLoading(false)
  }, [])

  const initializeScene = async () => {
    try {
      // Mock 3D model loading
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsModelLoaded(true)
      
      // Start auto-rotation if enabled
      if (configuration.autoRotate) {
        startAutoRotation()
      }
    } catch (err) {
      console.error('Failed to initialize 3D scene:', err)
      setIsLoading(false)
    }
  }

  const startAutoRotation = useCallback(() => {
    if (autoRotate) {
      const animate = () => {
        setRotation(prev => ({
          x: prev.x,
          y: prev.y + configuration.rotationSpeed,
          z: prev.z
        }))
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [autoRotate, configuration.rotationSpeed])

  const stopAutoRotation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  useEffect(() => {
    if (autoRotate) {
      startAutoRotation()
    } else {
      stopAutoRotation()
    }
    
    return () => stopAutoRotation()
  }, [autoRotate, startAutoRotation, stopAutoRotation])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!configuration.interactions.rotate) return
    
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    stopAutoRotation()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !configuration.interactions.rotate) return
    
    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.01,
      y: prev.y + deltaX * 0.01,
      z: prev.z
    }))
    
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (autoRotate) {
      startAutoRotation()
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    if (!configuration.interactions.zoom) return
    
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setScale(prev => Math.max(0.5, Math.min(3, prev * delta)))
  }

  const handleMarkerClick = (marker: ARMarker) => {
    setSelectedMarker(marker)
    setShowInfo(true)
    
    onInteraction?.('marker_click', {
      markerId: marker.id,
      type: marker.type,
      title: marker.title
    })
  }

  const handleARMode = async () => {
    if (!arSupported) return
    
    try {
      const session = await (navigator as any).xr.requestSession('immersive-ar')
      setIsARMode(true)
      
      onInteraction?.('ar_mode_entered', {
        sessionId: session.id
      })
    } catch (err) {
      console.error('Failed to start AR session:', err)
    }
  }

  const handleScreenshot = () => {
    if (!canvasRef.current) return
    
    const link = document.createElement('a')
    link.download = `${configuration.vehicleId}-ar-view.png`
    link.href = canvasRef.current.toDataURL()
    link.click()
    
    onInteraction?.('screenshot', {
      timestamp: Date.now()
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AR Vehicle Experience',
        text: `Check out this amazing AR vehicle experience!`,
        url: window.location.href
      })
    }
    
    onInteraction?.('share', {
      platform: 'native'
    })
  }

  const handleReset = () => {
    setRotation({ x: 0, y: 0, z: 0 })
    setScale(configuration.scale)
    setAutoRotate(configuration.autoRotate)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading AR Experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          <button
            onClick={onClose}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
          >
            <X size={20} />
          </button>
          <div className="bg-black/50 px-3 py-2 rounded-lg">
            <span className="text-white text-sm font-medium">AR Vehicle Viewer</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {arSupported && (
            <button
              onClick={handleARMode}
              disabled={isARMode}
              className={`p-2 rounded-lg flex items-center space-x-2 ${
                isARMode 
                  ? 'bg-green-600 text-white' 
                  : 'bg-black/50 text-white hover:bg-black/70'
              }`}
            >
              <Smartphone size={16} />
              <span className="text-sm">{isARMode ? 'AR Active' : 'Enter AR'}</span>
            </button>
          )}
          
          <button
            onClick={handleScreenshot}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
          >
            <Camera size={16} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
          >
            <Share2 size={16} />
          </button>
          
          <button
            onClick={handleReset}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
          >
            <RotateCw size={16} />
          </button>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Main 3D View */}
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          {/* Canvas for 3D rendering */}
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-800 rounded-lg cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          />
          
          {/* Loading indicator */}
          {!isModelLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-lg">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm">Loading 3D Model...</p>
              </div>
            </div>
          )}
          
          {/* AR Markers */}
          {isModelLoaded && configuration.markers.map((marker) => (
            <button
              key={marker.id}
              onClick={() => handleMarkerClick(marker)}
              className="absolute bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors"
              style={{
                left: `${50 + marker.position.x * 30}%`,
                top: `${50 + marker.position.y * 30}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Box size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        <button
          onClick={() => setScale(prev => Math.min(3, prev + 0.1))}
          disabled={!configuration.interactions.zoom}
          className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 disabled:opacity-50"
        >
          <ZoomIn size={16} />
        </button>
        <button
          onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
          disabled={!configuration.interactions.zoom}
          className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 disabled:opacity-50"
        >
          <ZoomOut size={16} />
        </button>
      </div>

      {/* View Controls */}
      <div className="absolute left-4 bottom-4 flex items-center space-x-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-lg flex items-center space-x-2 ${
            autoRotate 
              ? 'bg-blue-600 text-white' 
              : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          <RotateCw size={16} />
          <span className="text-sm">Auto-Rotate</span>
        </button>
        
        <div className="bg-black/50 px-3 py-2 rounded-lg">
          <span className="text-white text-sm">Scale: {scale.toFixed(1)}x</span>
        </div>
      </div>

      {/* Device Support Info */}
      {!arSupported && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-white px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Monitor size={16} />
            <span className="text-sm">AR not supported on this device</span>
          </div>
        </div>
      )}

      {/* Marker Information Panel */}
      {showInfo && selectedMarker && (
        <div className="absolute top-20 right-4 bg-white rounded-lg shadow-xl p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{selectedMarker.title}</h3>
            <button
              onClick={() => setShowInfo(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-gray-600 text-sm mb-3">{selectedMarker.description}</p>
          
          {selectedMarker.action && (
            <button
              onClick={() => {
                onInteraction?.('marker_action', selectedMarker.action)
                setShowInfo(false)
              }}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {selectedMarker.action.type === 'highlight' && 'Highlight Feature'}
              {selectedMarker.action.type === 'info' && 'More Information'}
              {selectedMarker.action.type === 'configure' && 'Configure Option'}
            </button>
          )}
        </div>
      )}

      {/* AR Mode Indicator */}
      {isARMode && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">AR Mode Active</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ARVehicleViewer
