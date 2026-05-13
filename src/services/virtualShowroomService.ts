import { 
  VehicleModel, 
  VirtualTour, 
  TourScene, 
  TourHotspot, 
  ARConfiguration,
  ShowroomSession,
  ShowroomInteraction,
  VehicleConfiguration,
  ShowroomAnalytics,
  VehicleColor,
  TrimLevel,
  VehicleFeature,
  VehicleAccessory,
  FinancingOption
} from '@/types/virtualShowroom'

// Mock data generators
const generateMockVehicles = (): VehicleModel[] => {
  return [
    {
      id: 'vehicle_1',
      name: 'Tesla Model 3',
      brand: 'Tesla',
      model: 'Model 3',
      year: 2024,
      category: 'electric',
      price: 38990,
      images: {
        exterior: [
          '/api/vehicles/tesla3-exterior-1.jpg',
          '/api/vehicles/tesla3-exterior-2.jpg',
          '/api/vehicles/tesla3-exterior-3.jpg'
        ],
        interior: [
          '/api/vehicles/tesla3-interior-1.jpg',
          '/api/vehicles/tesla3-interior-2.jpg'
        ],
        wheels: [
          '/api/vehicles/tesla3-wheels-1.jpg',
          '/api/vehicles/tesla3-wheels-2.jpg'
        ],
        features: [
          '/api/vehicles/tesla3-feature-autopilot.jpg',
          '/api/vehicles/tesla3-feature-screen.jpg'
        ]
      },
      specifications: {
        engine: 'Electric Motor',
        transmission: 'Single-Speed Automatic',
        fuelType: 'Electric',
        seats: 5,
        doors: 4,
        dimensions: {
          length: 185.8,
          width: 72.2,
          height: 56.8,
          wheelbase: 113.2
        }
      },
      colors: [
        {
          id: 'color_1',
          name: 'Pearl White Multi-Coat',
          hexCode: '#FFFFFF',
          type: 'exterior',
          priceAdjustment: 0,
          images: ['/api/vehicles/tesla3-white.jpg']
        },
        {
          id: 'color_2',
          name: 'Solid Black',
          hexCode: '#000000',
          type: 'exterior',
          priceAdjustment: 1000,
          images: ['/api/vehicles/tesla3-black.jpg']
        },
        {
          id: 'color_3',
          name: 'Deep Blue Metallic',
          hexCode: '#1E3A8A',
          type: 'exterior',
          priceAdjustment: 1000,
          images: ['/api/vehicles/tesla3-blue.jpg']
        }
      ],
      trimLevels: [
        {
          id: 'trim_base',
          name: 'Rear-Wheel Drive',
          price: 38990,
          features: ['Autopilot', 'Premium Audio', 'Navigation'],
          specifications: { range: 272, acceleration: 5.8 },
          isStandard: true
        },
        {
          id: 'trim_long',
          name: 'Long Range',
          price: 45990,
          features: ['Enhanced Autopilot', 'Premium Audio', 'Navigation', 'Premium Interior'],
          specifications: { range: 358, acceleration: 4.4 },
          isStandard: false
        },
        {
          id: 'trim_performance',
          name: 'Performance',
          price: 52990,
          features: ['Full Self-Driving', 'Premium Audio', 'Navigation', 'Track Mode', 'Performance Wheels'],
          specifications: { range: 315, acceleration: 3.1 },
          isStandard: false
        }
      ],
      features: [
        {
          id: 'feature_autopilot',
          name: 'Autopilot',
          category: 'technology',
          description: 'Advanced driver assistance system',
          price: 6000,
          isStandard: false,
          icon: 'steering-wheel'
        },
        {
          id: 'feature_fsd',
          name: 'Full Self-Driving',
          category: 'technology',
          description: 'Complete autonomous driving capability',
          price: 12000,
          isStandard: false,
          icon: 'cpu'
        },
        {
          id: 'feature_premium_audio',
          name: 'Premium Audio System',
          category: 'comfort',
          description: '14-speaker premium audio system',
          price: 1000,
          isStandard: true,
          icon: 'speaker'
        }
      ],
      availability: {
        inStock: true,
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        locations: ['New York', 'Los Angeles', 'Chicago']
      }
    },
    {
      id: 'vehicle_2',
      name: 'BMW X5',
      brand: 'BMW',
      model: 'X5',
      year: 2024,
      category: 'suv',
      price: 62700,
      images: {
        exterior: [
          '/api/vehicles/bmwx5-exterior-1.jpg',
          '/api/vehicles/bmwx5-exterior-2.jpg'
        ],
        interior: [
          '/api/vehicles/bmwx5-interior-1.jpg',
          '/api/vehicles/bmwx5-interior-2.jpg'
        ],
        wheels: [
          '/api/vehicles/bmwx5-wheels-1.jpg',
          '/api/vehicles/bmwx5-wheels-2.jpg'
        ],
        features: [
          '/api/vehicles/bmwx5-feature-driving.jpg',
          '/api/vehicles/bmwx5-feature-interior.jpg'
        ]
      },
      specifications: {
        engine: '3.0L TwinPower Turbo 6-Cylinder',
        transmission: '8-Speed Steptronic Automatic',
        fuelType: 'Gasoline',
        seats: 7,
        doors: 4,
        dimensions: {
          length: 194.3,
          width: 78.9,
          height: 68.7,
          wheelbase: 117.1
        }
      },
      colors: [
        {
          id: 'color_bmw_1',
          name: 'Alpine White',
          hexCode: '#FFFFFF',
          type: 'exterior',
          priceAdjustment: 0,
          images: ['/api/vehicles/bmwx5-white.jpg']
        },
        {
          id: 'color_bmw_2',
          name: 'Jet Black',
          hexCode: '#000000',
          type: 'exterior',
          priceAdjustment: 550,
          images: ['/api/vehicles/bmwx5-black.jpg']
        }
      ],
      trimLevels: [
        {
          id: 'trim_xdrive40i',
          name: 'xDrive40i',
          price: 62700,
          features: ['Leather Seats', 'Moonroof', 'Navigation Pro'],
          specifications: { horsepower: 335, torque: 331 },
          isStandard: true
        },
        {
          id: 'trim_xdrive50i',
          name: 'xDrive50i',
          price: 73900,
          features: ['Premium Leather', 'Executive Package', 'Navigation Pro', 'Harman Kardon Audio'],
          specifications: { horsepower: 475, torque: 479 },
          isStandard: false
        }
      ],
      features: [
        {
          id: 'feature_driving_assist',
          name: 'Driving Assistance Professional',
          category: 'safety',
          description: 'Advanced driver assistance systems',
          price: 1700,
          isStandard: false,
          icon: 'shield'
        },
        {
          id: 'feature_moonroof',
          name: 'Panoramic Moonroof',
          category: 'comfort',
          description: 'Large panoramic glass moonroof',
          price: 1350,
          isStandard: false,
          icon: 'sun'
        }
      ],
      availability: {
        inStock: true,
        estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        locations: ['New York', 'Los Angeles', 'Miami']
      }
    }
  ]
}

const generateMockVirtualTours = (): VirtualTour[] => {
  return [
    {
      id: 'tour_1',
      vehicleId: 'vehicle_1',
      title: 'Tesla Model 3 Virtual Experience',
      description: 'Explore the Tesla Model 3 in stunning 360° detail',
      duration: 180,
      thumbnail: '/api/tours/tesla3-thumb.jpg',
      videoUrl: '/api/tours/tesla3-tour.mp4',
      arEnabled: true,
      arModelUrl: '/api/ar/tesla3.glb',
      scenes: [
        {
          id: 'scene_exterior',
          name: 'Exterior Overview',
          type: 'exterior',
          thumbnail: '/api/tours/tesla3-exterior-thumb.jpg',
          image360: '/api/tours/tesla3-exterior-360.jpg',
          cameraPosition: { x: 0, y: 5, z: 10 },
          lighting: { ambient: 0.4, directional: 0.8, intensity: 1 }
        },
        {
          id: 'scene_interior',
          name: 'Interior Experience',
          type: 'interior',
          thumbnail: '/api/tours/tesla3-interior-thumb.jpg',
          image360: '/api/tours/tesla3-interior-360.jpg',
          cameraPosition: { x: 0, y: 2, z: 5 },
          lighting: { ambient: 0.3, directional: 0.6, intensity: 0.8 }
        },
        {
          id: 'scene_trunk',
          name: 'Trunk & Storage',
          type: 'trunk',
          thumbnail: '/api/tours/tesla3-trunk-thumb.jpg',
          image360: '/api/tours/tesla3-trunk-360.jpg',
          cameraPosition: { x: 0, y: 1, z: 8 },
          lighting: { ambient: 0.5, directional: 0.7, intensity: 0.9 }
        }
      ],
      hotspots: [
        {
          id: 'hotspot_autopilot',
          sceneId: 'scene_interior',
          position: { x: 0, y: 1.2, z: 2 },
          type: 'feature',
          title: 'Autopilot System',
          description: 'Advanced driver assistance with automatic steering, acceleration, and braking',
          media: {
            type: 'video',
            url: '/api/tours/autopilot-demo.mp4'
          },
          action: {
            type: 'configure',
            data: { featureId: 'feature_autopilot' }
          }
        },
        {
          id: 'hotspot_screen',
          sceneId: 'scene_interior',
          position: { x: 0, y: 0.8, z: 1.5 },
          type: 'feature',
          title: '15" Touchscreen Display',
          description: 'Large touchscreen with navigation, media, and vehicle controls',
          media: {
            type: 'image',
            url: '/api/tours/screen-detail.jpg'
          },
          action: {
            type: 'more_info',
            data: { section: 'infotainment' }
          }
        }
      ]
    },
    {
      id: 'tour_2',
      vehicleId: 'vehicle_2',
      title: 'BMW X5 Virtual Experience',
      description: 'Experience luxury and performance in the BMW X5',
      duration: 240,
      thumbnail: '/api/tours/bmwx5-thumb.jpg',
      videoUrl: '/api/tours/bmwx5-tour.mp4',
      arEnabled: true,
      arModelUrl: '/api/ar/bmwx5.glb',
      scenes: [
        {
          id: 'scene_bmw_exterior',
          name: 'Exterior Design',
          type: 'exterior',
          thumbnail: '/api/tours/bmwx5-exterior-thumb.jpg',
          image360: '/api/tours/bmwx5-exterior-360.jpg',
          cameraPosition: { x: 0, y: 5, z: 12 },
          lighting: { ambient: 0.3, directional: 0.9, intensity: 1.2 }
        },
        {
          id: 'scene_bmw_interior',
          name: 'Luxury Interior',
          type: 'interior',
          thumbnail: '/api/tours/bmwx5-interior-thumb.jpg',
          image360: '/api/tours/bmwx5-interior-360.jpg',
          cameraPosition: { x: 0, y: 2, z: 6 },
          lighting: { ambient: 0.4, directional: 0.7, intensity: 1 }
        }
      ],
      hotspots: [
        {
          id: 'hotspot_bmw_driving',
          sceneId: 'scene_bmw_interior',
          position: { x: 0, y: 1, z: 2 },
          type: 'feature',
          title: 'Driving Assistance',
          description: 'Advanced safety and driver assistance systems',
          action: {
            type: 'configure',
            data: { featureId: 'feature_driving_assist' }
          }
        }
      ]
    }
  ]
}

const generateMockARConfigurations = (): ARConfiguration[] => {
  return [
    {
      id: 'ar_config_1',
      vehicleId: 'vehicle_1',
      enabled: true,
      modelUrl: '/api/ar/tesla3.glb',
      textureUrl: '/api/ar/tesla3-texture.jpg',
      scale: 1,
      rotationSpeed: 0.5,
      autoRotate: true,
      lighting: {
        ambient: 0.4,
        directional: 0.8,
        castShadows: true
      },
      interactions: {
        zoom: true,
        rotate: true,
        pan: true,
        hotspots: true
      },
      markers: [
        {
          id: 'ar_marker_1',
          type: 'feature',
          position: { x: 0, y: 1.5, z: 0 },
          title: 'Autopilot Camera',
          description: 'Forward-facing camera for Autopilot system',
          icon: 'camera',
          action: {
            type: 'highlight',
            data: { component: 'autopilot_camera' }
          }
        }
      ]
    }
  ]
}

// Service class
class VirtualShowroomService {
  private simulateDelay = (ms: number = 500) => 
    new Promise(resolve => setTimeout(resolve, ms))

  // Vehicle Management
  async getVehicles(): Promise<{ success: boolean; data: VehicleModel[]; message?: string }> {
    await this.simulateDelay(800)
    return {
      success: true,
      data: generateMockVehicles()
    }
  }

  async getVehicleById(id: string): Promise<{ success: boolean; data: VehicleModel | null; message?: string }> {
    await this.simulateDelay(600)
    const vehicles = generateMockVehicles()
    const vehicle = vehicles.find(v => v.id === id)
    return {
      success: !!vehicle,
      data: vehicle || null,
      message: vehicle ? 'Vehicle found' : 'Vehicle not found'
    }
  }

  // Virtual Tour Management
  async getVirtualTours(vehicleId?: string): Promise<{ success: boolean; data: VirtualTour[]; message?: string }> {
    await this.simulateDelay(700)
    const tours = generateMockVirtualTours()
    const filteredTours = vehicleId ? tours.filter(t => t.vehicleId === vehicleId) : tours
    return {
      success: true,
      data: filteredTours
    }
  }

  async getVirtualTourById(id: string): Promise<{ success: boolean; data: VirtualTour | null; message?: string }> {
    await this.simulateDelay(500)
    const tours = generateMockVirtualTours()
    const tour = tours.find(t => t.id === id)
    return {
      success: !!tour,
      data: tour || null,
      message: tour ? 'Tour found' : 'Tour not found'
    }
  }

  // AR Configuration Management
  async getARConfiguration(vehicleId: string): Promise<{ success: boolean; data: ARConfiguration | null; message?: string }> {
    await this.simulateDelay(400)
    const configs = generateMockARConfigurations()
    const config = configs.find(c => c.vehicleId === vehicleId)
    return {
      success: !!config,
      data: config || null,
      message: config ? 'AR configuration found' : 'AR configuration not found'
    }
  }

  // Session Management
  async createShowroomSession(session: Omit<ShowroomSession, 'id'>): Promise<{ success: boolean; data: ShowroomSession; message?: string }> {
    await this.simulateDelay(300)
    const newSession: ShowroomSession = {
      id: `session_${Date.now()}`,
      ...session,
      startTime: new Date(),
      interactions: [],
      conversionActions: []
    }
    return {
      success: true,
      data: newSession,
      message: 'Showroom session created'
    }
  }

  async updateShowroomSession(id: string, updates: Partial<ShowroomSession>): Promise<{ success: boolean; data: ShowroomSession | null; message?: string }> {
    await this.simulateDelay(400)
    // In a real implementation, this would update the session in a database
    const updatedSession: ShowroomSession = {
      id,
      userId: updates.userId,
      vehicleId: updates.vehicleId || '',
      startTime: updates.startTime || new Date(),
      endTime: updates.endTime,
      duration: updates.duration,
      interactions: updates.interactions || [],
      configuration: updates.configuration || { vehicleId: '', totalPrice: 0, features: [], accessories: [] },
      arUsed: updates.arUsed || false,
      conversionActions: updates.conversionActions || []
    }
    return {
      success: true,
      data: updatedSession,
      message: 'Showroom session updated'
    }
  }

  // Analytics
  async getShowroomAnalytics(vehicleId?: string, dateRange?: { start: Date; end: Date }): Promise<{ success: boolean; data: ShowroomAnalytics; message?: string }> {
    await this.simulateDelay(1000)
    
    // Mock analytics data
    const analytics: ShowroomAnalytics = {
      totalSessions: 1247,
      averageDuration: 245, // seconds
      conversionRate: 12.5, // percentage
      popularFeatures: [
        {
          featureId: 'feature_autopilot',
          name: 'Autopilot',
          views: 892,
          interactions: 342
        },
        {
          featureId: 'feature_premium_audio',
          name: 'Premium Audio',
          views: 756,
          interactions: 234
        }
      ],
      popularConfigurations: [
        {
          configuration: {
            vehicleId: 'vehicle_1',
            totalPrice: 45990,
            features: [
              { id: 'feature_autopilot', name: 'Autopilot', category: 'technology', description: '', price: 6000, isStandard: false },
              { id: 'feature_premium_audio', name: 'Premium Audio', category: 'comfort', description: '', price: 1000, isStandard: true }
            ],
            accessories: []
          },
          count: 34
        }
      ],
      arUsageRate: 67.3, // percentage
      deviceBreakdown: {
        desktop: 45.2,
        mobile: 32.1,
        tablet: 18.7,
        vr: 4.0
      },
      timeSpentByScene: [
        {
          sceneId: 'scene_exterior',
          sceneName: 'Exterior Overview',
          averageTime: 89,
          totalViews: 1123
        },
        {
          sceneId: 'scene_interior',
          sceneName: 'Interior Experience',
          averageTime: 156,
          totalViews: 987
        }
      ]
    }
    return {
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully'
    }
  }

  // Configuration Management
  async calculateVehicleConfiguration(configuration: VehicleConfiguration): Promise<{ success: boolean; data: VehicleConfiguration; message?: string }> {
    await this.simulateDelay(600)
    
    // Calculate total price with mock logic
    let totalPrice = 0
    const vehicle = generateMockVehicles().find(v => v.id === configuration.vehicleId)
    
    if (vehicle) {
      // Base price from trim level
      const trimPrice = configuration.trimLevel?.price || vehicle.trimLevels[0].price
      totalPrice += trimPrice
      
      // Add color price adjustment
      if (configuration.color?.priceAdjustment) {
        totalPrice += configuration.color.priceAdjustment
      }
      
      // Add feature prices
      totalPrice += configuration.features.reduce((sum, feature) => sum + feature.price, 0)
      
      // Add accessory prices
      totalPrice += configuration.accessories.reduce((sum, accessory) => sum + accessory.price, 0)
    }
    
    const updatedConfiguration: VehicleConfiguration = {
      ...configuration,
      totalPrice,
      estimatedMonthlyPayment: totalPrice * 0.02, // Mock calculation
      financingOptions: [
        {
          id: 'loan_36',
          term: 36,
          apr: 4.9,
          downPayment: totalPrice * 0.1,
          monthlyPayment: totalPrice * 0.03,
          totalAmount: totalPrice,
          provider: 'Eagle Vision Finance',
          type: 'loan'
        },
        {
          id: 'lease_36',
          term: 36,
          apr: 3.9,
          downPayment: totalPrice * 0.05,
          monthlyPayment: totalPrice * 0.025,
          totalAmount: totalPrice * 0.9,
          provider: 'Eagle Vision Leasing',
          type: 'lease'
        }
      ]
    }
    
    return {
      success: true,
      data: updatedConfiguration,
      message: 'Configuration calculated successfully'
    }
  }

  // AR Support
  async checkARSupport(): Promise<{ success: boolean; data: { supported: boolean; capabilities: string[] }; message?: string }> {
    await this.simulateDelay(200)
    
    // Check device capabilities
    const capabilities = []
    let supported = false
    
    if ('xr' in navigator && (navigator as any).xr) {
      supported = true
      capabilities.push('WebXR')
    }
    
    if ('WebGL2RenderingContext' in window) {
      capabilities.push('WebGL2')
    }
    
    if ('OffscreenCanvas' in window) {
      capabilities.push('OffscreenCanvas')
    }
    
    return {
      success: true,
      data: {
        supported,
        capabilities
      },
      message: supported ? 'AR supported' : 'AR not supported'
    }
  }
}

export const virtualShowroomService = new VirtualShowroomService()
