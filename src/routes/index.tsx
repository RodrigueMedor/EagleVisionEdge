import { Routes as ReactRoutes, Route, Navigate, Outlet } from 'react-router-dom'
import ProtectedRoute from '@/components/rbac/ProtectedRoute'
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
const DealerLoginPage = lazy(() => import('@/pages/auth/DealerLoginPage'))
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
const AIDashboard = lazy(() => import('@/pages/dashboard/AIDashboard'))

// CRM Pages
const CRMDashboardPage = lazy(() => import('@/pages/dashboard/CRM/CRMDashboardPage'))
const CRMLeadManagementPage = lazy(() => import('@/pages/dashboard/CRM/LeadManagementPage'))
const CRMSalesPipelinePage = lazy(() => import('@/pages/dashboard/CRM/SalesPipelinePage'))
const CRMCustomerProfilePage = lazy(() => import('@/pages/dashboard/CRM/CustomerProfilePage'))
const CRMFollowUpManagementPage = lazy(() => import('@/pages/dashboard/CRM/FollowUpManagementPage'))
const CRMCommunicationCenterPage = lazy(() => import('@/pages/dashboard/CRM/CommunicationCenterPage'))
const CRMFinancingWorkflowPage = lazy(() => import('@/pages/dashboard/CRM/FinancingWorkflowPage'))
const CRMRentalWorkflowPage = lazy(() => import('@/pages/dashboard/CRM/RentalWorkflowPage'))
const CRMAIRecommendationsPage = lazy(() => import('@/pages/dashboard/CRM/AIRecommendationsPage'))
const CRMAnalyticsPage = lazy(() => import('@/pages/dashboard/CRM/CRMAnalyticsPage'))

// Phase 3 Advanced Features
const VirtualShowroomPage = lazy(() => import('@/pages/dashboard/VirtualShowroom/VirtualShowroomPage'))
const PredictiveMaintenancePage = lazy(() => import('@/pages/dashboard/PredictiveMaintenance/PredictiveMaintenancePage'))
const UserManagementPage = lazy(() => import('@/components/rbac/UserManagementDashboard'))
const PermissionManagementPage = lazy(() => import('@/components/rbac/PermissionManagement'))

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
          <Route path="/dealer-login" element={<DealerLoginPage />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute fallbackPath="/login"><Outlet /></ProtectedRoute>}>
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
            <Route path="/dashboard/ai" element={<AIDashboard />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/users" element={<UserManagementPage />} />
            <Route path="/dashboard/permissions" element={<PermissionManagementPage />} />
            {/* CRM Routes */}
            <Route path="/dashboard/crm" element={<CRMDashboardPage />} />
            <Route path="/dashboard/crm/leads" element={<CRMLeadManagementPage />} />
            <Route path="/dashboard/crm/pipeline" element={<CRMSalesPipelinePage />} />
            <Route path="/dashboard/crm/customers/:id" element={<CRMCustomerProfilePage />} />
            <Route path="/dashboard/crm/follow-ups" element={<CRMFollowUpManagementPage />} />
            <Route path="/dashboard/crm/communications" element={<CRMCommunicationCenterPage />} />
            <Route path="/dashboard/crm/financing" element={<CRMFinancingWorkflowPage />} />
            <Route path="/dashboard/crm/rentals" element={<CRMRentalWorkflowPage />} />
            <Route path="/dashboard/crm/ai-recommendations" element={<CRMAIRecommendationsPage />} />
            <Route path="/dashboard/crm/analytics" element={<CRMAnalyticsPage />} />
            {/* Phase 3 Advanced Features */}
            <Route path="/dashboard/virtual-showroom" element={<VirtualShowroomPage />} />
            <Route path="/dashboard/predictive-maintenance" element={<PredictiveMaintenancePage />} />
          </Route>
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </ReactRoutes>
    </Suspense>
  )
}
