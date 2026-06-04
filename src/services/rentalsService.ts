import { Rental } from '@/types/rental'
import { mockRentals } from '@/data/mockRentals'

const STORAGE_KEY = 'eagle_vision_rentals'

const loadFromStorage = (): Rental[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return JSON.parse(JSON.stringify(mockRentals))
}

const saveToStorage = (data: Rental[]): void => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

let rentalsData: Rental[] = loadFromStorage()

export const rentalsService = {
  async getRentals(): Promise<Rental[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    rentalsData = loadFromStorage()
    return rentalsData
  },

  async getRentalById(id: string): Promise<Rental> {
    await new Promise(resolve => setTimeout(resolve, 200))
    rentalsData = loadFromStorage()
    const rental = rentalsData.find((r: Rental) => r.id === id)
    if (!rental) throw new Error('Rental not found')
    return rental
  },

  async filterRentals(filters: { status?: string }): Promise<Rental[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    rentalsData = loadFromStorage()
    if (filters.status) return rentalsData.filter((r: Rental) => r.status === filters.status)
    return rentalsData
  },

  async addRental(rental: Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rental> {
    await new Promise(resolve => setTimeout(resolve, 300))
    rentalsData = loadFromStorage()
    const newRental: Rental = {
      ...rental,
      id: `rental_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    rentalsData.push(newRental)
    saveToStorage(rentalsData)
    return newRental
  },

  async updateRental(id: string, updates: Partial<Rental>): Promise<Rental> {
    await new Promise(resolve => setTimeout(resolve, 300))
    rentalsData = loadFromStorage()
    const index = rentalsData.findIndex((r: Rental) => r.id === id)
    if (index === -1) throw new Error('Rental not found')
    rentalsData[index] = { ...rentalsData[index], ...updates, updatedAt: new Date() }
    saveToStorage(rentalsData)
    return rentalsData[index]
  },

  async deleteRental(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    rentalsData = loadFromStorage()
    const index = rentalsData.findIndex((r: Rental) => r.id === id)
    if (index === -1) throw new Error('Rental not found')
    rentalsData.splice(index, 1)
    saveToStorage(rentalsData)
  },

  async getRentalStats(): Promise<{
    total: number
    active: number
    pending: number
    completed: number
    cancelled: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 150))
    rentalsData = loadFromStorage()
    return {
      total: rentalsData.length,
      active: rentalsData.filter((r: Rental) => r.status === 'active').length,
      pending: rentalsData.filter((r: Rental) => r.status === 'pending').length,
      completed: rentalsData.filter((r: Rental) => r.status === 'completed').length,
      cancelled: rentalsData.filter((r: Rental) => r.status === 'cancelled').length,
    }
  },
}
