// Virtual Showroom Types for Eagle Vision Edge

export interface VehicleModel {
  id: string
  name: string
  brand: string
  model: string
  year: number
  category: 'sedan' | 'suv' | 'truck' | 'sports' | 'electric' | 'hybrid'
  price: number
  images: {
    exterior: string[]
    interior: string[]
    wheels: string[]
    features: string[]
  }
  specifications: {
    engine: string
    transmission: string
    fuelType: string
    seats: number
    doors: number
    dimensions: {
      length: number
      width: number
      height: number
      wheelbase: number
    }
  }
  colors: VehicleColor[]
  trimLevels: TrimLevel[]
  features: VehicleFeature[]
  availability: {
    inStock: boolean
    estimatedDelivery?: Date
    locations: string[]
  }
}

export interface VehicleColor {
  id: string
  name: string
  hexCode: string
  type: 'exterior' | 'interior'
  priceAdjustment?: number
  images: string[]
}

export interface TrimLevel {
  id: string
  name: string
  price: number
  features: string[]
  specifications: Record<string, any>
  isStandard?: boolean
}

export interface VehicleFeature {
  id: string
  name: string
  category: 'performance' | 'safety' | 'comfort' | 'technology' | 'exterior' | 'interior'
  description: string
  price: number
  isStandard?: boolean
  icon?: string
}

export interface VirtualTour {
  id: string
  vehicleId: string
  title: string
  description: string
  duration: number // in seconds
  thumbnail: string
  videoUrl?: string
  scenes: TourScene[]
  hotspots: TourHotspot[]
  arEnabled: boolean
  arModelUrl?: string
}

export interface TourScene {
  id: string
  name: string
  type: 'exterior' | 'interior' | 'trunk' | 'engine' | 'features'
  thumbnail: string
  videoUrl?: string
  image360?: string
  cameraPosition: {
    x: number
    y: number
    z: number
  }
  lighting: {
    ambient: number
    directional: number
    intensity: number
  }
}

export interface TourHotspot {
  id: string
  sceneId: string
  position: {
    x: number
    y: number
    z: number
  }
  type: 'feature' | 'info' | 'comparison' | 'action'
  title: string
  description: string
  media?: {
    type: 'image' | 'video' | '3d'
    url: string
  }
  action?: {
    type: 'configure' | 'test_drive' | 'quote' | 'more_info'
    data?: Record<string, any>
  }
}

export interface ARConfiguration {
  id: string
  vehicleId: string
  enabled: boolean
  modelUrl: string
  textureUrl?: string
  scale: number
  rotationSpeed: number
  autoRotate: boolean
  lighting: {
    ambient: number
    directional: number
    castShadows: boolean
  }
  interactions: {
    zoom: boolean
    rotate: boolean
    pan: boolean
    hotspots: boolean
  }
  markers: ARMarker[]
}

export interface ARMarker {
  id: string
  type: 'feature' | 'dimension' | 'comparison'
  position: {
    x: number
    y: number
    z: number
  }
  title: string
  description: string
  icon?: string
  action?: {
    type: 'highlight' | 'info' | 'configure'
    data?: Record<string, any>
  }
}

export interface ShowroomSession {
  id: string
  userId?: string
  vehicleId: string
  startTime: Date
  endTime?: Date
  duration?: number
  interactions: ShowroomInteraction[]
  configuration: VehicleConfiguration
  arUsed: boolean
  conversionActions: ConversionAction[]
}

export interface ShowroomInteraction {
  id: string
  timestamp: Date
  type: 'view_360' | 'view_ar' | 'hotspot_click' | 'color_change' | 'trim_change' | 'feature_select' | 'scene_change'
  data: Record<string, any>
  duration?: number
}

export interface VehicleConfiguration {
  vehicleId: string
  color?: VehicleColor
  trimLevel?: TrimLevel
  features: VehicleFeature[]
  accessories: VehicleAccessory[]
  totalPrice: number
  estimatedMonthlyPayment?: number
  financingOptions?: FinancingOption[]
}

export interface VehicleAccessory {
  id: string
  name: string
  category: 'performance' | 'appearance' | 'protection' | 'technology' | 'convenience'
  price: number
  description: string
  image?: string
  compatibility: string[]
}

export interface FinancingOption {
  id: string
  term: number // in months
  apr: number
  downPayment: number
  monthlyPayment: number
  totalAmount: number
  provider: string
  type: 'loan' | 'lease' | 'balloon'
}

export interface ConversionAction {
  id: string
  type: 'test_drive' | 'quote_request' | 'financing_application' | 'contact_sales' | 'save_configuration'
  timestamp: Date
  data: Record<string, any>
  completed: boolean
}

export interface ShowroomAnalytics {
  totalSessions: number
  averageDuration: number
  conversionRate: number
  popularFeatures: {
    featureId: string
    name: string
    views: number
    interactions: number
  }[]
  popularConfigurations: {
    configuration: VehicleConfiguration
    count: number
  }[]
  arUsageRate: number
  deviceBreakdown: {
    desktop: number
    mobile: number
    tablet: number
    vr: number
  }
  timeSpentByScene: {
    sceneId: string
    sceneName: string
    averageTime: number
    totalViews: number
  }[]
}

export interface VirtualShowroomSettings {
  autoRotate: boolean
  rotationSpeed: number
  enableAR: boolean
  enableHotspots: boolean
  enableComparison: boolean
  defaultScene: string
  quality: 'low' | 'medium' | 'high' | 'ultra'
  enableAudio: boolean
  enableSubtitles: boolean
}
