import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Vehicle } from '@/types/vehicle'
import { Lead } from '@/types/lead'
import { Customer } from '@/types/customer'
import { Rental } from '@/types/rental'
import { FinancingApplication } from '@/types/financing'
import { DashboardMetrics } from '@/types/dashboard'

interface DataContextType {
  // Data state
  vehicles: Vehicle[]
  leads: Lead[]
  customers: Customer[]
  rentals: Rental[]
  financingApplications: FinancingApplication[]
  dashboardMetrics: DashboardMetrics | null
  
  // Loading states
  vehiclesLoading: boolean
  leadsLoading: boolean
  customersLoading: boolean
  rentalsLoading: boolean
  financingLoading: boolean
  dashboardLoading: boolean
  
  // Actions
  refreshVehicles: () => Promise<void>
  refreshLeads: () => Promise<void>
  refreshCustomers: () => Promise<void>
  refreshRentals: () => Promise<void>
  refreshFinancing: () => Promise<void>
  refreshDashboard: () => Promise<void>
  refreshAll: () => Promise<void>
  
  // Update functions
  updateVehicle: (vehicle: Vehicle) => void
  updateLead: (lead: Lead) => void
  updateCustomer: (customer: Customer) => void
  updateRental: (rental: Rental) => void
  updateFinancingApplication: (application: FinancingApplication) => void
  
  // Add functions
  addVehicle: (vehicle: Vehicle) => void
  addLead: (lead: Lead) => void
  addCustomer: (customer: Customer) => void
  addRental: (rental: Rental) => void
  addFinancingApplication: (application: FinancingApplication) => void
  
  // Delete functions
  deleteVehicle: (id: string) => void
  deleteLead: (id: string) => void
  deleteCustomer: (id: string) => void
  deleteRental: (id: string) => void
  deleteFinancingApplication: (id: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

interface DataProviderProps {
  children: ReactNode
}

export function DataProvider({ children }: DataProviderProps) {
  // Data state
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [rentals, setRentals] = useState<Rental[]>([])
  const [financingApplications, setFinancingApplications] = useState<FinancingApplication[]>([])
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null)
  
  // Loading states
  const [vehiclesLoading, setVehiclesLoading] = useState(false)
  const [leadsLoading, setLeadsLoading] = useState(false)
  const [customersLoading, setCustomersLoading] = useState(false)
  const [rentalsLoading, setRentalsLoading] = useState(false)
  const [financingLoading, setFinancingLoading] = useState(false)
  const [dashboardLoading, setDashboardLoading] = useState(false)

  // Refresh functions
  const refreshVehicles = useCallback(async () => {
    setVehiclesLoading(true)
    try {
      // Import dynamically to avoid circular dependencies
      const { inventoryService } = await import('@/services/inventoryService')
      const data = await inventoryService.getVehicles()
      setVehicles(data)
    } catch (error) {
      console.error('Failed to refresh vehicles:', error)
    } finally {
      setVehiclesLoading(false)
    }
  }, [])

  const refreshLeads = useCallback(async () => {
    setLeadsLoading(true)
    try {
      const { leadsService } = await import('@/services/leadsService')
      const data = await leadsService.getLeads()
      setLeads(data)
    } catch (error) {
      console.error('Failed to refresh leads:', error)
    } finally {
      setLeadsLoading(false)
    }
  }, [])

  const refreshCustomers = useCallback(async () => {
    setCustomersLoading(true)
    try {
      const { customersService } = await import('@/services/customersService')
      const data = await customersService.getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Failed to refresh customers:', error)
    } finally {
      setCustomersLoading(false)
    }
  }, [])

  const refreshRentals = useCallback(async () => {
    setRentalsLoading(true)
    try {
      const { rentalsService } = await import('@/services/rentalsService')
      const data = await rentalsService.getRentals()
      setRentals(data)
    } catch (error) {
      console.error('Failed to refresh rentals:', error)
    } finally {
      setRentalsLoading(false)
    }
  }, [])

  const refreshFinancing = useCallback(async () => {
    setFinancingLoading(true)
    try {
      const { FinancingService } = await import('@/services/financingService')
      // Note: FinancingService doesn't have getApplications method, using mock data for now
      const data: FinancingApplication[] = [] // Mock empty array since service doesn't provide this method
      setFinancingApplications(data)
    } catch (error) {
      console.error('Failed to refresh financing:', error)
    } finally {
      setFinancingLoading(false)
    }
  }, [])

  const refreshDashboard = useCallback(async () => {
    setDashboardLoading(true)
    try {
      const { dashboardService } = await import('@/services/dashboardService')
      const data = await dashboardService.getDashboardMetrics()
      setDashboardMetrics(data)
    } catch (error) {
      console.error('Failed to refresh dashboard:', error)
    } finally {
      setDashboardLoading(false)
    }
  }, [])

  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshVehicles(),
      refreshLeads(),
      refreshCustomers(),
      refreshRentals(),
      refreshFinancing(),
      refreshDashboard()
    ])
  }, [refreshVehicles, refreshLeads, refreshCustomers, refreshRentals, refreshFinancing, refreshDashboard])

  // Update functions
  const updateVehicle = useCallback((vehicle: Vehicle) => {
    setVehicles(prev => prev.map(v => v.id === vehicle.id ? vehicle : v))
  }, [])

  const updateLead = useCallback((lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? lead : l))
  }, [])

  const updateCustomer = useCallback((customer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === customer.id ? customer : c))
  }, [])

  const updateRental = useCallback((rental: Rental) => {
    setRentals(prev => prev.map(r => r.id === rental.id ? rental : r))
  }, [])

  const updateFinancingApplication = useCallback((application: FinancingApplication) => {
    setFinancingApplications(prev => prev.map(a => a.id === application.id ? application : a))
  }, [])

  // Add functions
  const addVehicle = useCallback((vehicle: Vehicle) => {
    setVehicles(prev => [vehicle, ...prev])
  }, [])

  const addLead = useCallback((lead: Lead) => {
    setLeads(prev => [lead, ...prev])
  }, [])

  const addCustomer = useCallback((customer: Customer) => {
    setCustomers(prev => [customer, ...prev])
  }, [])

  const addRental = useCallback((rental: Rental) => {
    setRentals(prev => [rental, ...prev])
  }, [])

  const addFinancingApplication = useCallback((application: FinancingApplication) => {
    setFinancingApplications(prev => [application, ...prev])
  }, [])

  // Delete functions
  const deleteVehicle = useCallback((id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id))
  }, [])

  const deleteLead = useCallback((id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id))
  }, [])

  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id))
  }, [])

  const deleteRental = useCallback((id: string) => {
    setRentals(prev => prev.filter(r => r.id !== id))
  }, [])

  const deleteFinancingApplication = useCallback((id: string) => {
    setFinancingApplications(prev => prev.filter(a => a.id !== id))
  }, [])

  return (
    <DataContext.Provider
      value={{
        // Data state
        vehicles,
        leads,
        customers,
        rentals,
        financingApplications,
        dashboardMetrics,
        
        // Loading states
        vehiclesLoading,
        leadsLoading,
        customersLoading,
        rentalsLoading,
        financingLoading,
        dashboardLoading,
        
        // Actions
        refreshVehicles,
        refreshLeads,
        refreshCustomers,
        refreshRentals,
        refreshFinancing,
        refreshDashboard,
        refreshAll,
        
        // Update functions
        updateVehicle,
        updateLead,
        updateCustomer,
        updateRental,
        updateFinancingApplication,
        
        // Add functions
        addVehicle,
        addLead,
        addCustomer,
        addRental,
        addFinancingApplication,
        
        // Delete functions
        deleteVehicle,
        deleteLead,
        deleteCustomer,
        deleteRental,
        deleteFinancingApplication
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
