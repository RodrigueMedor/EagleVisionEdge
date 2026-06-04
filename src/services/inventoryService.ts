import { Vehicle, VehicleStatus } from '@/types/vehicle'
import { mockVehicles } from '@/data/mockVehicles'

const STORAGE_KEY = 'eagle_vision_inventory'

const loadFromStorage = (): Vehicle[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return mockVehicles
}

const saveToStorage = (data: Vehicle[]): void => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

let vehiclesData: Vehicle[] = loadFromStorage()

export const inventoryService = {
  async getVehicles(): Promise<Vehicle[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    vehiclesData = loadFromStorage()
    return vehiclesData
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    await new Promise(resolve => setTimeout(resolve, 200))
    vehiclesData = loadFromStorage()
    const vehicle = vehiclesData.find((v: Vehicle) => v.id === id)
    if (!vehicle) throw new Error('Vehicle not found')
    return vehicle
  },

  async searchVehicles(query: string): Promise<Vehicle[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lowerQuery = query.toLowerCase()
    vehiclesData = loadFromStorage()
    return vehiclesData.filter((v: Vehicle) =>
      `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(lowerQuery)
    )
  },

  async filterVehicles(filters: {
    make?: string
    minPrice?: number
    maxPrice?: number
    bodyType?: string
    status?: VehicleStatus
  }): Promise<Vehicle[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    vehiclesData = loadFromStorage()
    return vehiclesData.filter((v: Vehicle) => {
      if (filters.make && v.make !== filters.make) return false
      if (filters.minPrice && v.price < filters.minPrice) return false
      if (filters.maxPrice && v.price > filters.maxPrice) return false
      if (filters.bodyType && v.bodyType !== filters.bodyType) return false
      if (filters.status && v.status !== filters.status) return false
      return true
    })
  },

  async addVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Vehicle> {
    await new Promise(resolve => setTimeout(resolve, 300))
    vehiclesData = loadFromStorage()
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `vehicle_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    vehiclesData.push(newVehicle)
    saveToStorage(vehiclesData)
    return newVehicle
  },

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    await new Promise(resolve => setTimeout(resolve, 300))
    vehiclesData = loadFromStorage()
    const index = vehiclesData.findIndex((v: Vehicle) => v.id === id)
    if (index === -1) throw new Error('Vehicle not found')
    vehiclesData[index] = { ...vehiclesData[index], ...updates, updatedAt: new Date() }
    saveToStorage(vehiclesData)
    return vehiclesData[index]
  },

  async updateVehicleStatus(id: string, status: VehicleStatus): Promise<Vehicle> {
    return this.updateVehicle(id, { status })
  },

  async deleteVehicle(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    vehiclesData = loadFromStorage()
    const index = vehiclesData.findIndex((v: Vehicle) => v.id === id)
    if (index === -1) throw new Error('Vehicle not found')
    vehiclesData.splice(index, 1)
    saveToStorage(vehiclesData)
  },

  async getInventoryStats(): Promise<{
    total: number
    available: number
    sold: number
    rented: number
    maintenance: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 150))
    vehiclesData = loadFromStorage()
    return {
      total: vehiclesData.length,
      available: vehiclesData.filter((v: Vehicle) => v.status === 'available').length,
      sold: vehiclesData.filter((v: Vehicle) => v.status === 'sold').length,
      rented: vehiclesData.filter((v: Vehicle) => v.status === 'rented').length,
      maintenance: vehiclesData.filter((v: Vehicle) => v.status === 'maintenance').length,
    }
  },
}
