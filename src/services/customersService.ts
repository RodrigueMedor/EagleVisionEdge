// Mock Customers Service
import { Customer } from '@/types/customer'
import { mockCustomers } from '@/data/mockCustomers'

const customersData = JSON.parse(JSON.stringify(mockCustomers))

export const customersService = {
  async getCustomers(): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return customersData
  },

  async getCustomerById(id: string): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const customer = customersData.find((c: Customer) => c.id === id)
    if (!customer) {
      throw new Error('Customer not found')
    }
    return customer
  },

  async searchCustomers(query: string): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    const lowerQuery = query.toLowerCase()
    return customersData.filter((c: Customer) =>
      `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase().includes(lowerQuery)
    )
  },

  async filterCustomers(filters: { segment?: string }): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    if (filters.segment) {
      return customersData.filter((c: Customer) => c.segment === filters.segment)
    }
    return customersData
  },

  async addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newCustomer: Customer = {
      ...customer,
      id: `cust_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    customersData.push(newCustomer)
    return newCustomer
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = customersData.findIndex((c: Customer) => c.id === id)
    if (index === -1) {
      throw new Error('Customer not found')
    }
    customersData[index] = {
      ...customersData[index],
      ...updates,
      updatedAt: new Date(),
    }
    return customersData[index]
  },

  async deleteCustomer(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = customersData.findIndex((c: Customer) => c.id === id)
    if (index === -1) {
      throw new Error('Customer not found')
    }
    customersData.splice(index, 1)
  },

  async getCustomerStats(): Promise<{
    total: number
    vip: number
    regular: number
    interested: number
  }> {
    await new Promise(resolve => setTimeout(resolve, 150))
    return {
      total: customersData.length,
      vip: customersData.filter((c: Customer) => c.segment === 'vip').length,
      regular: customersData.filter((c: Customer) => c.segment === 'regular').length,
      interested: customersData.filter((c: Customer) => c.segment === 'interested').length,
    }
  },
}

