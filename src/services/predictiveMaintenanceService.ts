import {
  VehicleTelemetry,
  MaintenanceAlert,
  MaintenanceSchedule,
  PredictiveModel,
  MaintenanceAnalytics,
  MaintenancePart,
  MaintenanceHistory,
  ServiceRecommendation,
  IoTDevice
} from '@/types/predictiveMaintenance'

// Mock data generators
const generateMockTelemetry = (): VehicleTelemetry[] => {
  return [
    {
      id: 'telemetry_1',
      vehicleId: 'vehicle_001',
      customerId: 'customer_001',
      timestamp: new Date(),
      mileage: 45230,
      engineHours: 1520,
      fuelLevel: 0.65,
      oilLife: 0.25,
      tirePressure: [
        { position: 'front_left', pressure: 32, recommendedPressure: 35, status: 'low', lastChecked: new Date() },
        { position: 'front_right', pressure: 34, recommendedPressure: 35, status: 'low', lastChecked: new Date() },
        { position: 'rear_left', pressure: 33, recommendedPressure: 35, status: 'low', lastChecked: new Date() },
        { position: 'rear_right', pressure: 32.5, recommendedPressure: 35, status: 'low', lastChecked: new Date() }
      ],
      batteryHealth: {
        voltage: 12.6,
        health: 85,
        temperature: 25,
        chargeCycles: 342,
        estimatedReplacement: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        status: 'good'
      },
      engineTemperature: 92,
      transmissionTemperature: 85,
      brakeWear: {
        frontLeft: 0.65,
        frontRight: 0.62,
        rearLeft: 0.58,
        rearRight: 0.60,
        average: 0.61,
        status: 'fair',
        estimatedReplacement: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
      },
      fluidLevels: [
        { type: 'engine_oil', level: 0.25, quality: 'fair', lastChanged: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), recommendedChange: new Date() },
        { type: 'coolant', level: 0.70, quality: 'good', lastChanged: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), recommendedChange: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) },
        { type: 'brake_fluid', level: 0.80, quality: 'good', lastChanged: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), recommendedChange: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
        { type: 'transmission_fluid', level: 0.85, quality: 'excellent', lastChanged: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), recommendedChange: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000) }
      ],
      diagnosticCodes: [
        { code: 'P0420', severity: 'warning', description: 'Catalyst System Efficiency Below Threshold', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), isActive: true, recommendedAction: 'Inspect catalytic converter and oxygen sensors', estimatedCost: 450 },
        { code: 'P0456', severity: 'info', description: 'Evaporative Emission Control System Leak Detected', timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), isActive: false, recommendedAction: 'Check gas cap for proper seal', estimatedCost: 0 }
      ],
      gpsLocation: {
        latitude: 40.7128,
        longitude: -74.0060,
        accuracy: 5,
        timestamp: new Date(),
        speed: 0,
        heading: 45
      },
      drivingBehavior: {
        averageSpeed: 42,
        maxSpeed: 85,
        accelerationEvents: 12,
        brakingEvents: 8,
        corneringEvents: 15,
        idlingTime: 15,
        fuelEfficiency: 28.5,
        harshDrivingScore: 78
      },
      lastServiceDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      nextServiceDue: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    }
  ]
}

const generateMockMaintenanceAlerts = (): MaintenanceAlert[] => {
  return [
    {
      id: 'alert_001',
      vehicleId: 'vehicle_001',
      customerId: 'customer_001',
      type: 'oil_change',
      priority: 'high',
      title: 'Oil Change Required Soon',
      description: 'Engine oil life is at 25%. Based on current driving patterns, oil change recommended within 500 miles.',
      predictedIssue: 'Oil degradation will lead to reduced engine performance and potential engine damage',
      confidence: 92,
      estimatedCost: 65,
      estimatedTime: 0.75,
      urgency: 'within_week',
      recommendedAction: 'Schedule oil change with synthetic oil and filter replacement',
      partsNeeded: [
        { id: 'part_001', name: 'Engine Oil 5W-30', category: 'fluids', partNumber: 'EO-5W30-5QT', price: 35, availability: 'in_stock', oemPart: true },
        { id: 'part_002', name: 'Oil Filter', category: 'filters', partNumber: 'OF-12345', price: 15, availability: 'in_stock', oemPart: true }
      ],
      toolsNeeded: ['Oil filter wrench', 'Drain pan', 'Funnel'],
      skillLevel: 'diy',
      preventionTips: [
        'Check oil level monthly',
        'Use manufacturer recommended oil type',
        'Avoid extreme driving conditions until serviced'
      ],
      createdAt: new Date()
    },
    {
      id: 'alert_002',
      vehicleId: 'vehicle_001',
      customerId: 'customer_001',
      type: 'tire_replacement',
      priority: 'medium',
      title: 'Tire Pressure Low',
      description: 'All tires showing 10-15% below recommended pressure. This affects fuel efficiency and tire wear.',
      predictedIssue: 'Under-inflated tires will reduce fuel economy by 3% and increase tire wear by 25%',
      confidence: 88,
      estimatedCost: 0,
      estimatedTime: 0.25,
      urgency: 'immediate',
      recommendedAction: 'Inflate tires to recommended pressure of 35 PSI',
      partsNeeded: [],
      toolsNeeded: ['Tire pressure gauge', 'Air compressor'],
      skillLevel: 'diy',
      preventionTips: [
        'Check tire pressure monthly',
        'Rotate tires every 6,000 miles',
        'Check pressure when tires are cold'
      ],
      createdAt: new Date()
    },
    {
      id: 'alert_003',
      vehicleId: 'vehicle_001',
      customerId: 'customer_001',
      type: 'brake_service',
      priority: 'medium',
      title: 'Brake Pad Replacement Recommended',
      description: 'Front brake pads at 65% wear. Based on driving patterns, replacement recommended in 3,000 miles.',
      predictedIssue: 'Worn brake pads will increase stopping distance and potentially damage rotors',
      confidence: 79,
      estimatedCost: 280,
      estimatedTime: 1.5,
      urgency: 'within_month',
      recommendedAction: 'Replace front brake pads and inspect rotors',
      partsNeeded: [
        { id: 'part_003', name: 'Front Brake Pads', category: 'brakes', partNumber: 'BP-FRONT-SET', price: 120, availability: 'in_stock', oemPart: true },
        { id: 'part_004', name: 'Brake Cleaner', category: 'brakes', partNumber: 'BC-16OZ', price: 15, availability: 'in_stock', oemPart: false }
      ],
      toolsNeeded: ['Brake caliper tool', 'C-clamp', 'Torque wrench'],
      skillLevel: 'mechanic',
      preventionTips: [
        'Avoid aggressive braking',
        'Check brake fluid level regularly',
        'Listen for brake squealing or grinding'
      ],
      createdAt: new Date()
    },
    {
      id: 'alert_004',
      vehicleId: 'vehicle_001',
      customerId: 'customer_001',
      type: 'battery_replacement',
      priority: 'low',
      title: 'Battery Health Monitoring',
      description: 'Battery health at 85%. Performance degradation expected in 12 months based on current usage patterns.',
      predictedIssue: 'Gradual battery capacity loss will lead to starting issues, especially in cold weather',
      confidence: 85,
      estimatedCost: 185,
      estimatedTime: 0.5,
      urgency: 'within_3_months',
      recommendedAction: 'Plan battery replacement within next 12 months',
      partsNeeded: [
        { id: 'part_005', name: '12V Car Battery', category: 'electronics', partNumber: 'BATT-48AGM', price: 165, availability: 'in_stock', oemPart: true }
      ],
      toolsNeeded: ['Battery wrench set', 'Terminal cleaner'],
      skillLevel: 'diy',
      preventionTips: [
        'Keep battery terminals clean',
        'Check electrical connections',
        'Minimize short trips',
        'Test battery voltage monthly'
      ],
      createdAt: new Date()
    }
  ]
}

const generateMockPredictiveModels = (): PredictiveModel[] => {
  return [
    {
      id: 'model_001',
      name: 'Engine Oil Life Predictor',
      version: '2.1.0',
      accuracy: 94.2,
      trainedOn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      parameters: [
        { name: 'oil_degradation_rate', value: 0.9, importance: 0.9, description: 'Rate of oil quality degradation per 1000 miles' },
        { name: 'driving_conditions_factor', value: 0.7, importance: 0.7, description: 'Environmental and road condition impact' },
        { name: 'engine_load_average', value: 0.8, importance: 0.8, description: 'Average engine load during operation' },
        { name: 'temperature_stress', value: 0.6, importance: 0.6, description: 'Impact of temperature on oil life' }
      ],
      features: ['ML-based regression', 'Real-time telemetry analysis', 'Environmental adaptation'],
      targetVariable: 'oil_life_percentage',
      lastUpdated: new Date(),
      isActive: true
    },
    {
      id: 'model_002',
      name: 'Tire Wear Predictor',
      version: '1.8.3',
      accuracy: 89.7,
      trainedOn: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      parameters: [
        { name: 'wear_rate_per_mile', value: 0.85, importance: 0.85, description: 'Tire tread wear per mile driven' },
        { name: 'pressure_variance_impact', value: 0.75, importance: 0.75, description: 'Effect of pressure variation on wear' },
        { name: 'driving_style_factor', value: 0.7, importance: 0.7, description: 'Impact of aggressive driving on tire wear' },
        { name: 'road_surface_type', value: 0.6, importance: 0.6, description: 'Road surface impact on tire longevity' }
      ],
      features: ['Computer vision analysis', 'Pressure sensor fusion', 'Historical pattern matching'],
      targetVariable: 'remaining_tread_depth',
      lastUpdated: new Date(),
      isActive: true
    },
    {
      id: 'model_003',
      name: 'Battery Health Predictor',
      version: '3.0.1',
      accuracy: 91.3,
      trainedOn: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      parameters: [
        { name: 'charge_cycle_impact', value: 0.8, importance: 0.8, description: 'Impact of charging cycles on battery health' },
        { name: 'temperature_degradation', value: 0.75, importance: 0.75, description: 'Temperature effect on battery capacity' },
        { name: 'age_factor', value: 0.9, importance: 0.9, description: 'Natural battery aging over time' },
        { name: 'load_pattern_analysis', value: 0.7, importance: 0.7, description: 'Electrical load pattern recognition' }
      ],
      features: ['Voltage analysis', 'Temperature monitoring', 'Load pattern recognition', 'Age-based degradation'],
      targetVariable: 'battery_health_percentage',
      lastUpdated: new Date(),
      isActive: true
    }
  ]
}

// Service class
class PredictiveMaintenanceService {
  private simulateDelay = (ms: number = 500) => 
    new Promise(resolve => setTimeout(resolve, ms))

  // Telemetry Management
  async getVehicleTelemetry(vehicleId: string): Promise<{ success: boolean; data: VehicleTelemetry | null; message?: string }> {
    await this.simulateDelay(600)
    const telemetryData = generateMockTelemetry()
    const telemetry = telemetryData.find(t => t.vehicleId === vehicleId)
    return {
      success: !!telemetry,
      data: telemetry || null,
      message: telemetry ? 'Telemetry data retrieved' : 'Telemetry data not found'
    }
  }

  async updateTelemetry(vehicleId: string, updates: Partial<VehicleTelemetry>): Promise<{ success: boolean; data: VehicleTelemetry | null; message?: string }> {
    await this.simulateDelay(400)
    // In real implementation, this would update telemetry in database
    const telemetryData = generateMockTelemetry()
    const existingTelemetry = telemetryData.find(t => t.vehicleId === vehicleId)
    
    if (existingTelemetry) {
      const updatedTelemetry: VehicleTelemetry = {
        ...existingTelemetry,
        ...updates,
        timestamp: new Date()
      }
      return {
        success: true,
        data: updatedTelemetry,
        message: 'Telemetry updated successfully'
      }
    }
    
    return {
      success: false,
      data: null,
      message: 'Telemetry not found'
    }
  }

  // Maintenance Alerts
  async getMaintenanceAlerts(customerId?: string, vehicleId?: string): Promise<{ success: boolean; data: MaintenanceAlert[]; message?: string }> {
    await this.simulateDelay(700)
    const alerts = generateMockMaintenanceAlerts()
    let filteredAlerts = alerts
    
    if (customerId) {
      filteredAlerts = filteredAlerts.filter(a => a.customerId === customerId)
    }
    
    if (vehicleId) {
      filteredAlerts = filteredAlerts.filter(a => a.vehicleId === vehicleId)
    }
    
    return {
      success: true,
      data: filteredAlerts
    }
  }

  async createMaintenanceAlert(alert: Omit<MaintenanceAlert, 'id' | 'createdAt'>): Promise<{ success: boolean; data: MaintenanceAlert; message?: string }> {
    await this.simulateDelay(300)
    
    const newAlert: MaintenanceAlert = {
      id: `alert_${Date.now()}`,
      ...alert,
      createdAt: new Date()
    }
    
    return {
      success: true,
      data: newAlert,
      message: 'Maintenance alert created successfully'
    }
  }

  async acknowledgeMaintenanceAlert(alertId: string): Promise<{ success: boolean; message?: string }> {
    await this.simulateDelay(200)
    // In real implementation, this would update alert in database
    return {
      success: true,
      message: 'Maintenance alert acknowledged'
    }
  }

  async resolveMaintenanceAlert(alertId: string, resolution: string): Promise<{ success: boolean; message?: string }> {
    await this.simulateDelay(400)
    // In real implementation, this would mark alert as resolved in database
    return {
      success: true,
      message: 'Maintenance alert resolved'
    }
  }

  // Predictive Analytics
  async getPredictiveModels(): Promise<{ success: boolean; data: PredictiveModel[]; message?: string }> {
    await this.simulateDelay(500)
    return {
      success: true,
      data: generateMockPredictiveModels()
    }
  }

  async runPredictiveAnalysis(vehicleId: string, modelIds: string[]): Promise<{ success: boolean; data: MaintenanceAlert[]; message?: string }> {
    await this.simulateDelay(2000)
    
    // Mock predictive analysis
    const newAlerts: MaintenanceAlert[] = []
    
    // Simulate running different models
    for (const modelId of modelIds) {
      if (modelId === 'model_001') {
        // Oil life model
        newAlerts.push({
          id: `predicted_${Date.now()}_oil`,
          vehicleId,
          customerId: 'customer_001',
          type: 'oil_change',
          priority: 'medium',
          title: 'Predicted Oil Change Needed',
          description: 'AI model predicts oil change needed in approximately 800 miles based on current driving patterns',
          predictedIssue: 'Oil quality degradation will affect engine performance',
          confidence: 89,
          estimatedCost: 75,
          estimatedTime: 0.75,
          urgency: 'within_month',
          recommendedAction: 'Schedule oil change with synthetic oil',
          partsNeeded: [
            { id: 'part_001', name: 'Engine Oil 5W-30', category: 'fluids', partNumber: 'EO-5W30-5QT', price: 45, availability: 'in_stock', oemPart: true }
          ],
          toolsNeeded: ['Oil filter wrench', 'Drain pan'],
          skillLevel: 'diy',
          preventionTips: ['Check oil level regularly', 'Monitor for leaks'],
          createdAt: new Date()
        })
      } else if (modelId === 'model_002') {
        // Tire wear model
        newAlerts.push({
          id: `predicted_${Date.now()}_tires`,
          vehicleId,
          customerId: 'customer_001',
          type: 'tire_replacement',
          priority: 'low',
          title: 'Predicted Tire Replacement',
          description: 'AI model predicts tire replacement needed in approximately 5,000 miles based on wear patterns',
          predictedIssue: 'Tire tread wear will affect safety and fuel efficiency',
          confidence: 85,
          estimatedCost: 480,
          estimatedTime: 1.5,
          urgency: 'within_3_months',
          recommendedAction: 'Plan for tire replacement and alignment',
          partsNeeded: [
            { id: 'part_006', name: 'All-Season Tires', category: 'tires', partNumber: 'TIRE-225-65R17', price: 400, availability: 'in_stock', oemPart: true }
          ],
          toolsNeeded: ['Tire changer', 'Wheel alignment tool'],
          skillLevel: 'mechanic',
          preventionTips: ['Rotate tires regularly', 'Check pressure monthly'],
          createdAt: new Date()
        })
      }
    }
    
    return {
      success: true,
      data: newAlerts,
      message: `Predictive analysis completed using ${modelIds.length} models`
    }
  }

  // Maintenance Scheduling
  async scheduleMaintenance(schedule: Omit<MaintenanceSchedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: MaintenanceSchedule; message?: string }> {
    await this.simulateDelay(500)
    
    const newSchedule: MaintenanceSchedule = {
      id: `schedule_${Date.now()}`,
      ...schedule,
      createdAt: new Date(),
      updatedAt: new Date(),
      reminders: [
        {
          id: `reminder_${Date.now()}_email`,
          type: 'email',
          scheduledFor: new Date(schedule.scheduledDate.getTime() - 24 * 60 * 60 * 1000),
          sent: false,
          message: `Reminder: ${schedule.title} scheduled for ${schedule.scheduledDate.toLocaleDateString()}`,
          recipient: 'customer@example.com'
        },
        {
          id: `reminder_${Date.now()}_sms`,
          type: 'sms',
          scheduledFor: new Date(schedule.scheduledDate.getTime() - 2 * 60 * 60 * 1000),
          sent: false,
          message: `Reminder: ${schedule.title} on ${schedule.scheduledDate.toLocaleDateString()}`,
          recipient: '+1234567890'
        }
      ]
    }
    
    return {
      success: true,
      data: newSchedule,
      message: 'Maintenance scheduled successfully'
    }
  }

  // Analytics
  async getMaintenanceAnalytics(customerId?: string, dateRange?: { start: Date; end: Date }): Promise<{ success: boolean; data: MaintenanceAnalytics; message?: string }> {
    await this.simulateDelay(1200)
    
    // Mock analytics data
    const analytics: MaintenanceAnalytics = {
      totalAlerts: 47,
      criticalAlerts: 3,
      preventedBreakdowns: 8,
      costSavings: 2850,
      uptime: 96.7,
      averageResolutionTime: 2.3,
      customerSatisfaction: 4.6,
      predictiveAccuracy: 89.4,
      commonIssues: [
        { issueType: 'oil_change', count: 15, percentage: 31.9 },
        { issueType: 'tire_replacement', count: 12, percentage: 25.5 },
        { issueType: 'brake_service', count: 8, percentage: 17.0 },
        { issueType: 'battery_replacement', count: 7, percentage: 14.9 }
      ],
      costAnalysis: {
        preventive: 1250,
        corrective: 3200,
        predicted: 850,
        savings: 2850
      },
      trendData: [
        { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), alerts: 12, resolved: 10, costs: 450 },
        { date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), alerts: 15, resolved: 14, costs: 680 },
        { date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), alerts: 20, resolved: 18, costs: 920 }
      ]
    }
    
    return {
      success: true,
      data: analytics,
      message: 'Analytics retrieved successfully'
    }
  }

  // IoT Device Management
  async getIoTDevices(vehicleId?: string): Promise<{ success: boolean; data: IoTDevice[]; message?: string }> {
    await this.simulateDelay(400)
    
    const devices: IoTDevice[] = [
      {
        id: 'iot_001',
        vehicleId: 'vehicle_001',
        type: 'obd_device',
        manufacturer: 'Veepeak',
        model: 'OBDCheck Pro',
        firmwareVersion: '3.2.1',
        lastSeen: new Date(),
        batteryLevel: 85,
        signalStrength: 92,
        isActive: true,
        dataPoints: 15420,
        installationDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'iot_002',
        vehicleId: 'vehicle_001',
        type: 'tire_sensor',
        manufacturer: 'TireGuard',
        model: 'TPMS-2000',
        firmwareVersion: '2.1.4',
        lastSeen: new Date(),
        batteryLevel: 92,
        signalStrength: 88,
        isActive: true,
        dataPoints: 8920,
        installationDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'iot_003',
        vehicleId: 'vehicle_001',
        type: 'battery_monitor',
        manufacturer: 'BatteryPro',
        model: 'BM-12V',
        firmwareVersion: '1.8.2',
        lastSeen: new Date(),
        batteryLevel: 78,
        signalStrength: 95,
        isActive: true,
        dataPoints: 6540,
        installationDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
      }
    ]
    
    let filteredDevices = devices
    if (vehicleId) {
      filteredDevices = devices.filter(d => d.vehicleId === vehicleId)
    }
    
    return {
      success: true,
      data: filteredDevices,
      message: 'IoT devices retrieved successfully'
    }
  }

  // Service Recommendations
  async getServiceRecommendations(vehicleId: string): Promise<{ success: boolean; data: ServiceRecommendation[]; message?: string }> {
    await this.simulateDelay(800)
    
    const recommendations: ServiceRecommendation[] = [
      {
        id: 'rec_001',
        vehicleId,
        customerId: 'customer_001',
        type: 'preventive',
        title: 'Seasonal Tire Change Recommendation',
        description: 'Based on weather patterns and your driving habits, consider switching to winter tires in next 30 days',
        priority: 'medium',
        estimatedCost: 480,
        estimatedTime: 1.5,
        benefits: ['Improved safety in winter conditions', 'Better fuel efficiency', 'Extended tire life'],
        risks: ['Reduced performance on dry roads', 'Higher initial cost'],
        seasonalConsiderations: ['Winter approaching', 'Current all-season tires showing wear'],
        basedOn: {
          telemetry: true,
          mileage: true,
          time: true,
          drivingConditions: true,
          manufacturer: false
        },
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'rec_002',
        vehicleId,
        customerId: 'customer_001',
        type: 'immediate',
        title: 'Fuel System Cleaning Recommended',
        description: 'AI analysis indicates fuel system deposits building up. Cleaning recommended to maintain fuel efficiency',
        priority: 'low',
        estimatedCost: 120,
        estimatedTime: 0.75,
        benefits: ['Improved fuel economy', 'Smoother acceleration', 'Reduced emissions'],
        risks: ['Service cost', 'Downtime'],
        basedOn: {
          telemetry: true,
          mileage: false,
          time: false,
          drivingConditions: true,
          manufacturer: true
        },
        createdAt: new Date()
      }
    ]
    
    return {
      success: true,
      data: recommendations,
      message: 'Service recommendations generated successfully'
    }
  }
}

export const predictiveMaintenanceService = new PredictiveMaintenanceService()
