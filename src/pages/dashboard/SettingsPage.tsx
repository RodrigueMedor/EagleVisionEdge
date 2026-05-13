import { useState, useEffect } from 'react'
import { User, Bell, Shield, Palette, Database, HelpCircle, Building, Mail, Phone, MapPin, Globe, CreditCard } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/hooks'
import { settingsService } from '@/services/settingsService'
import { DealershipSettings, UserSettings } from '@/types/settings'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dealership')
  const [dealershipSettings, setDealershipSettings] = useState<DealershipSettings | null>(null)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'dealership', label: 'Dealership', icon: Building },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const [dealership, userSettings] = await Promise.all([
        settingsService.getDealershipSettings(),
        settingsService.getUserSettings(user?.id || 'current-user')
      ])
      setDealershipSettings(dealership)
      setUserSettings(userSettings)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveDealershipSettings = async () => {
    if (!dealershipSettings) return
    setSaving(true)
    try {
      await settingsService.updateDealershipSettings(dealershipSettings)
      // Show success notification
    } catch (error) {
      console.error('Failed to save dealership settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const saveUserSettings = async () => {
    if (!userSettings) return
    setSaving(true)
    try {
      await settingsService.updateUserSettings(user?.id || 'current-user', userSettings)
      // Show success notification
    } catch (error) {
      console.error('Failed to save user settings:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'dealership' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Dealership Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dealership Name</label>
                    <Input
                      value={dealershipSettings?.name || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {...prev, name: e.target.value} : null)}
                      placeholder="Enter dealership name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input
                      value={dealershipSettings?.contact?.phone || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {
                        ...prev, 
                        contact: { ...prev.contact, phone: e.target.value }
                      } : null)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input
                      value={dealershipSettings?.contact?.email || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {
                        ...prev, 
                        contact: { ...prev.contact, email: e.target.value }
                      } : null)}
                      type="email"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <Input
                      value={dealershipSettings?.contact?.website || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {
                        ...prev, 
                        contact: { ...prev.contact, website: e.target.value }
                      } : null)}
                      placeholder="Enter website URL"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <Input
                      value={dealershipSettings?.address?.street || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {
                        ...prev, 
                        address: { ...prev.address, street: e.target.value }
                      } : null)}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <Input
                      value={dealershipSettings?.address?.city || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {
                        ...prev, 
                        address: { ...prev.address, city: e.target.value }
                      } : null)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <Input
                      value={dealershipSettings?.address?.state || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {
                        ...prev, 
                        address: { ...prev.address, state: e.target.value }
                      } : null)}
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <Input
                      value={dealershipSettings?.address?.zipCode || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {
                        ...prev, 
                        address: { ...prev.address, zipCode: e.target.value }
                      } : null)}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={saveDealershipSettings} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="secondary" onClick={loadSettings}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <Button variant="secondary">Change Avatar</Button>
                    <p className="text-sm text-gray-600 mt-2">
                      JPG, GIF or PNG. Max size of 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input
                      value={user?.name || ''}
                      onChange={(e) => {/* User name is read-only for now */}}
                      placeholder="Enter full name"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input
                      value={user?.email || ''}
                      onChange={(e) => {/* Email is read-only for now */}}
                      type="email"
                      placeholder="Enter email address"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <Input
                      value={user?.role?.replace('_', ' ').toUpperCase() || ''}
                      onChange={(e) => {/* Role is read-only for now */}}
                      placeholder="Enter job title"
                      readOnly
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button onClick={saveUserSettings} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="secondary" onClick={loadSettings}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  'Email notifications for new leads',
                  'SMS alerts for urgent inquiries',
                  'Weekly performance reports',
                  'System maintenance notifications',
                  'New feature announcements',
                  'Security alerts',
                ].map((item, index) => (
                  <label key={index} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <span className="font-medium">{item}</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      defaultChecked={index < 3}
                    />
                  </label>
                ))}
              </div>
              <div className="mt-6">
                <Button>Update Preferences</Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <Input
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">Two-Factor Authentication</h2>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="secondary">Enable 2FA</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Appearance</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Light', 'Dark', 'System'].map((theme) => (
                      <label key={theme} className="cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          className="sr-only peer"
                          defaultChecked={theme === 'Light'}
                        />
                        <div className="p-4 border-2 rounded-lg peer-checked:border-blue-600 peer-checked:bg-blue-50">
                          <p className="font-medium text-center">{theme}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Language</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <Button>Save Preferences</Button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Data & Privacy</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Export Your Data</h3>
                  <p className="text-gray-600">
                    Download a copy of all your data, including leads, customers, and inventory information.
                  </p>
                  <Button variant="secondary">Export Data</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-gray-600">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Help & Support</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Documentation</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Browse our comprehensive documentation and guides.
                    </p>
                    <Button variant="secondary" size="sm">View Docs</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Contact Support</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Get help from our support team via email or chat.
                    </p>
                    <Button variant="secondary" size="sm">Contact Us</Button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">System Information</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Version: 1.0.0</p>
                    <p>Last Updated: November 2024</p>
                    <p>License: {user?.dealership?.name || 'Eagle Vision Edge'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}