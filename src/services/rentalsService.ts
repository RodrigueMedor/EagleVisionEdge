// Mock Rentals Service
import { Rental } from '@/types/rental'
import { mockRentals } from '@/data/mockRentals'

const rentalsData = JSON.parse(JSON.stringify(mockRentals))

export const rentalsService = {
  async getRentals(): Promise<Rental[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return rentalsData
  },

  async getRentalById(id: string): Promise<Rental> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const rental = rentalsData.find((r: Rental) => r.id === id)
    if (!rental) {
      throw new Error('Rental not found')
    }
    return rental
  },

  async filterRentals(filters: { status?: string }): Promise<Rental[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    if (filters.status) {
      return rentalsData.filter((r: Rental) => r.status === filters.status)
    }
    return rentalsData
  },

  async addRental(rental: Omit<Rental, 'id' | 'createdAt' | 'updatedAt'>): Promise<Rental> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newRental: Rental = {
      ...rental,
      id: `rental_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    rentalsData.push(newRental)
    return newRental
  },

  async updateRental(id: string, updates: Partial<Rental>): Promise<Rental> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = rentalsData.findIndex((r: Rental) => r.id === id)
    if (index === -1) {
      throw new Error('Rental not found')
    }
    rentalsData[index] = {
      ...rentalsData[index],
      ...updates,
      updatedAt: new Date(),
    }
    return rentalsData[index]
  },

  async deleteRental(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = rentalsData.findIndex((r: Rental) => r.id === id)
    if (index === -1) {
      throw new Error('Rental not found')
    }
    rentalsData.splice(index, 1)
  },

  async getRentalStats(): Promise<{
    total: number
    active: number
    pending: number
    completed: number
    cancelled: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 150))
    return {
      total: rentalsData.length,
      active: rentalsData.filter((r: Rental) => r.status === 'active').length,
      pending: rentalsData.filter((r: Rental) => r.status === 'pending').length,
      completed: rentalsData.filter((r: Rental) => r.status === 'completed').length,
      cancelled: rentalsData.filter((r: Rental) => r.status === 'cancelled').length,
    }
  },
}

