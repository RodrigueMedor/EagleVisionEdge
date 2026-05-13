// Predictive Maintenance Types for Eagle Vision Edge

export interface VehicleTelemetry {
  id: string
  vehicleId: string
  customerId: string
  timestamp: Date
  mileage: number
  engineHours: number
  fuelLevel: number
  oilLife: number
  tirePressure: TirePressure[]
  batteryHealth: BatteryHealth
  engineTemperature: number
  transmissionTemperature: number
  brakeWear: BrakeWear
  fluidLevels: FluidLevel[]
  diagnosticCodes: DiagnosticCode[]
  gpsLocation?: GPSLocation
  drivingBehavior: DrivingBehavior
  lastServiceDate: Date
  nextServiceDue: Date
}

export interface TirePressure {
  position: 'front_left' | 'front_right' | 'rear_left' | 'rear_right'
  pressure: number // PSI
  recommendedPressure: number
  status: 'normal' | 'low' | 'high' | 'critical'
  lastChecked: Date
}

export interface BatteryHealth {
  voltage: number // Volts
  health: number // Percentage (0-100)
  temperature: number // Celsius
  chargeCycles: number
  estimatedReplacement: Date
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
}

export interface BrakeWear {
  frontLeft: number // Percentage
  frontRight: number // Percentage
  rearLeft: number // Percentage
  rearRight: number // Percentage
  average: number
  status: 'excellent' | 'good' | 'fair' | 'replace_soon' | 'replace_now'
  estimatedReplacement: Date
}

export interface FluidLevel {
  type: 'engine_oil' | 'coolant' | 'brake_fluid' | 'transmission_fluid' | 'power_steering' | 'windshield_washer'
  level: number // Percentage
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  lastChanged: Date
  recommendedChange: Date
}

export interface DiagnosticCode {
  code: string
  severity: 'info' | 'warning' | 'critical'
  description: string
  timestamp: Date
  isActive: boolean
  recommendedAction: string
  estimatedCost?: number
}

export interface GPSLocation {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: Date
  speed?: number
  heading?: number
}

export interface DrivingBehavior {
  averageSpeed: number
  maxSpeed: number
  accelerationEvents: number
  brakingEvents: number
  corneringEvents: number
  idlingTime: number // Percentage
  fuelEfficiency: number // MPG or L/100km
  harshDrivingScore: number // 0-100
}

export interface MaintenanceAlert {
  id: string
  vehicleId: string
  customerId: string
  type: MaintenanceAlertType
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  predictedIssue: string
  confidence: number // Percentage (0-100)
  estimatedCost: number
  estimatedTime: number // Hours
  urgency: 'immediate' | 'within_week' | 'within_month' | 'within_3_months' | 'scheduled'
  recommendedAction: string
  partsNeeded: MaintenancePart[]
  toolsNeeded: string[]
  skillLevel: 'diy' | 'mechanic' | 'dealership'
  preventionTips: string[]
  createdAt: Date
  acknowledgedAt?: Date
  resolvedAt?: Date
  scheduledAppointment?: Date
}

export type MaintenanceAlertType = 
  | 'oil_change'
  | 'tire_replacement'
  | 'brake_service'
  | 'battery_replacement'
  | 'fluid_top_up'
  | 'engine_tune_up'
  | 'transmission_service'
  | 'coolant_flush'
  | 'air_filter_replacement'
  | 'spark_plug_replacement'
  | 'belt_replacement'
  | 'sensor_malfunction'
  | 'general_inspection'

export interface MaintenancePart {
  id: string
  name: string
  category: 'engine' | 'brakes' | 'tires' | 'electronics' | 'fluids' | 'filters'
  partNumber: string
  price: number
  availability: 'in_stock' | 'ordered' | 'special_order'
  estimatedDelivery?: Date
  oemPart: boolean
  aftermarketOption?: boolean
}

export interface MaintenanceSchedule {
  id: string
  vehicleId: string
  customerId: string
  title: string
  description: string
  scheduledDate: Date
  estimatedDuration: number // Hours
  estimatedCost: number
  priority: 'low' | 'medium' | 'high'
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  technician?: string
  parts: MaintenancePart[]
  notes?: string
  reminders: MaintenanceReminder[]
  createdAt: Date
  updatedAt: Date
}

export interface MaintenanceReminder {
  id: string
  type: 'email' | 'sms' | 'push' | 'in_app'
  scheduledFor: Date
  sent: boolean
  message: string
  recipient: string
}

export interface PredictiveModel {
  id: string
  name: string
  version: string
  accuracy: number // Percentage
  trainedOn: Date
  parameters: ModelParameter[]
  features: string[]
  targetVariable: string
  lastUpdated: Date
  isActive: boolean
}

export interface ModelParameter {
  name: string
  value: number
  importance: number // 0-1
  description: string
}

export interface MaintenanceAnalytics {
  totalAlerts: number
  criticalAlerts: number
  preventedBreakdowns: number
  costSavings: number
  uptime: number // Percentage
  averageResolutionTime: number // Hours
  customerSatisfaction: number // 0-5
  predictiveAccuracy: number // Percentage
  commonIssues: {
    issueType: MaintenanceAlertType
    count: number
    percentage: number
  }[]
  costAnalysis: {
    preventive: number
    corrective: number
    predicted: number
    savings: number
  }
  trendData: {
    date: Date
    alerts: number
    resolved: number
    costs: number
  }[]
}

export interface IoTDevice {
  id: string
  vehicleId: string
  type: 'obd_device' | 'tire_sensor' | 'battery_monitor' | 'gps_tracker' | 'temperature_sensor'
  manufacturer: string
  model: string
  firmwareVersion: string
  lastSeen: Date
  batteryLevel: number
  signalStrength: number
  isActive: boolean
  dataPoints: number
  installationDate: Date
}

export interface MaintenanceHistory {
  id: string
  vehicleId: string
  customerId: string
  serviceDate: Date
  serviceType: MaintenanceAlertType
  description: string
  mileage: number
  cost: number
  performedBy: string
  partsReplaced: MaintenancePart[]
  warrantyClaim?: boolean
  customerRating?: number // 1-5
  notes?: string
  beforeCondition: string
  afterCondition: string
  images?: string[]
}

export interface ServiceRecommendation {
  id: string
  vehicleId: string
  customerId: string
  type: 'immediate' | 'scheduled' | 'preventive'
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  estimatedCost: number
  estimatedTime: number
  benefits: string[]
  risks: string[]
  seasonalConsiderations?: string[]
  basedOn: {
    telemetry: boolean
    mileage: boolean
    time: boolean
    drivingConditions: boolean
    manufacturer: boolean
  }
  createdAt: Date
  expiresAt?: Date
}

export interface MaintenanceSettings {
  enablePredictiveAlerts: boolean
  alertThreshold: {
    oilLife: number
    tirePressure: number
    batteryHealth: number
    brakeWear: number
    engineTemperature: number
  }
  notificationPreferences: {
    email: boolean
    sms: boolean
    push: boolean
    frequency: 'immediate' | 'daily' | 'weekly'
  }
  serviceCenter: {
    preferredLocation: string
    alternateLocations: string[]
    transportationRequired: boolean
    loanerVehicle: boolean
  }
  budgetAlerts: {
    enabled: boolean
    threshold: number
    currency: string
  }
}
