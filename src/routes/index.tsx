import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicLayout from '@/layouts/PublicLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Lazy load pages for code splitting
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('@/pages/public/HomePage'))
const InventoryPage = lazy(() => import('@/pages/public/InventoryPage'))
const VehicleDetailPage = lazy(() => import('@/pages/public/VehicleDetailPage'))
const FinancingPage = lazy(() => import('@/pages/public/FinancingPage'))
const RentalsPage = lazy(() => import('@/pages/public/RentalsPage'))
const AuctionsPage = lazy(() => import('@/pages/public/AuctionsPage'))
const AboutPage = lazy(() => import('@/pages/public/AboutPage'))
const ContactPage = lazy(() => import('@/pages/public/ContactPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const DashboardHome = lazy(() => import('@/pages/dashboard/DashboardHome'))
const InventoryListPage = lazy(() => import('@/pages/dashboard/Inventory/InventoryListPage'))
const AddVehiclePage = lazy(() => import('@/pages/dashboard/Inventory/AddVehiclePage'))
const EditVehiclePage = lazy(() => import('@/pages/dashboard/Inventory/EditVehiclePage'))
const VehicleDetailsPage = lazy(() => import('@/pages/dashboard/Inventory/VehicleDetailsPage'))
const LeadsPage = lazy(() => import('@/pages/dashboard/Leads/LeadsPage'))
const LeadDetailPage = lazy(() => import('@/pages/dashboard/Leads/LeadDetailPage'))
const CustomersPage = lazy(() => import('@/pages/dashboard/Customers/CustomersPage'))
const CustomerDetailPage = lazy(() => import('@/pages/dashboard/Customers/CustomerDetailPage'))
const AnalyticsPage = lazy(() => import('@/pages/dashboard/AnalyticsPage'))
const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'))
const RentalsManagementPage = lazy(() => import('@/pages/dashboard/RentalsManagementPage'))

import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function Routes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ReactRoutes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
          <Route path="/financing" element={<FinancingPage />} />
          <Route path="/rentals" element={<RentalsPage />} />
          <Route path="/auctions" element={<AuctionsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute redirectTo="/login" />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/inventory" element={<InventoryListPage />} />
            <Route path="/dashboard/inventory/add" element={<AddVehiclePage />} />
            <Route path="/dashboard/inventory/:id/edit" element={<EditVehiclePage />} />
            <Route path="/dashboard/inventory/:id" element={<VehicleDetailsPage />} />
            <Route path="/dashboard/leads" element={<LeadsPage />} />
            <Route path="/dashboard/leads/:id" element={<LeadDetailPage />} />
            <Route path="/dashboard/customers" element={<CustomersPage />} />
            <Route path="/dashboard/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/dashboard/rentals" element={<RentalsManagementPage />} />
            <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </ReactRoutes>
    </Suspense>
  )
}


