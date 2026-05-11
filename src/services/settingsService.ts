// Mock Settings Service
import { DealershipSettings, UserSettings } from '@/types/settings'
import { mockDealershipSettings } from '@/data/mockSettings'

const dealershipSettingsData: DealershipSettings = {
  ...mockDealershipSettings,
  createdAt: new Date(mockDealershipSettings.createdAt),
  updatedAt: new Date(mockDealershipSettings.updatedAt)
}

export const settingsService = {
  async getDealershipSettings(): Promise<DealershipSettings> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return dealershipSettingsData
  },

  async updateDealershipSettings(updates: Partial<DealershipSettings>): Promise<DealershipSettings> {
    await new Promise(resolve => setTimeout(resolve, 300))
    Object.assign(dealershipSettingsData, updates, { updatedAt: new Date() })
    return dealershipSettingsData
  },

  async updateBranding(branding: Partial<DealershipSettings['branding']>): Promise<DealershipSettings> {
    await new Promise(resolve => setTimeout(resolve, 300))
    dealershipSettingsData.branding = { ...dealershipSettingsData.branding, ...branding }
    dealershipSettingsData.updatedAt = new Date()
    return dealershipSettingsData
  },

  async updateBusinessHours(hours: Partial<DealershipSettings['businessHours']>): Promise<DealershipSettings> {
    await new Promise(resolve => setTimeout(resolve, 300))
    dealershipSettingsData.businessHours = { ...dealershipSettingsData.businessHours, ...hours }
    dealershipSettingsData.updatedAt = new Date()
    return dealershipSettingsData
  },

  async updateContactInfo(contact: Partial<DealershipSettings['contact']>): Promise<DealershipSettings> {
    await new Promise(resolve => setTimeout(resolve, 300))
    dealershipSettingsData.contact = { ...dealershipSettingsData.contact, ...contact }
    dealershipSettingsData.updatedAt = new Date()
    return dealershipSettingsData
  },

  async updateFeatures(features: Partial<DealershipSettings['features']>): Promise<DealershipSettings> {
    await new Promise(resolve => setTimeout(resolve, 300))
    dealershipSettingsData.features = { ...dealershipSettingsData.features, ...features }
    dealershipSettingsData.updatedAt = new Date()
    return dealershipSettingsData
  },

  async updateNotificationSettings(notifications: Partial<DealershipSettings['notifications']>): Promise<DealershipSettings> {
    await new Promise(resolve => setTimeout(resolve, 300))
    dealershipSettingsData.notifications = { ...dealershipSettingsData.notifications, ...notifications }
    dealershipSettingsData.updatedAt = new Date()
    return dealershipSettingsData
  },

  async uploadLogo(file: File): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Mock upload - return a URL
    const logoUrl = `/images/logos/dealership-logo-${Date.now()}.png`
    dealershipSettingsData.logo = logoUrl
    dealershipSettingsData.updatedAt = new Date()
    return logoUrl
  },

  // User settings
  async getUserSettings(userId: string): Promise<UserSettings> {
    await new Promise(resolve => setTimeout(resolve, 200))
    // Mock user settings
    return {
      id: `settings_${userId}`,
      userId,
      theme: 'light',
      language: 'en',
      timezone: 'America/New_York',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD',
      notifications: {
        desktop: true,
        email: true,
        sms: false,
        leadAssigned: true,
        leadStatusChanged: true,
        vehicleSold: true,
        financingApproved: true,
        rentalBooked: true,
        systemMaintenance: true
      },
      dashboard: {
        defaultView: 'overview',
        widgets: ['kpi', 'sales', 'inventory', 'leads'],
        refreshInterval: 30000,
        showCharts: true,
        compactMode: false
      }
    }
  },

  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const currentSettings = await this.getUserSettings(userId)
    const updatedSettings = { ...currentSettings, ...updates }
    return updatedSettings
  },

  async resetUserSettings(userId: string): Promise<UserSettings> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return this.getUserSettings(userId)
  },

  async exportSettings(): Promise<DealershipSettings> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return dealershipSettingsData
  },

  async importSettings(settings: Partial<DealershipSettings>): Promise<DealershipSettings> {
    await new Promise(resolve => setTimeout(resolve, 500))
    Object.assign(dealershipSettingsData, settings, { updatedAt: new Date() })
    return dealershipSettingsData
  }
}
