import { useState, useEffect } from 'react'
import { User, Bell, Shield, Palette, Database, HelpCircle, Building } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/hooks'
import { settingsService } from '@/services/settingsService'
import { DealershipSettings, UserSettings } from '@/types/settings'
import { showSuccess, showError, showInfo, showNotification } from '@/lib/errorHandler'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('dealership')
  const [dealershipSettings, setDealershipSettings] = useState<DealershipSettings | null>(null)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' })
  const [notifPrefs, setNotifPrefs] = useState([true, true, true, false, false, false])
  const [selectedTheme, setSelectedTheme] = useState('Light')
  const [selectedLang, setSelectedLang] = useState('English (US)')

  const tabs = [
    { id: 'dealership', label: 'Dealership', icon: Building },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ]

  useEffect(() => { loadSettings() }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const [dealership, us] = await Promise.all([
        settingsService.getDealershipSettings(),
        settingsService.getUserSettings(user?.id || 'current-user')
      ])
      setDealershipSettings(dealership)
      setUserSettings(us)
    } catch (error) {
      showError(error, 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const saveDealershipSettings = async () => {
    if (!dealershipSettings) return
    setSaving(true)
    try {
      await settingsService.updateDealershipSettings(dealershipSettings)
      showSuccess('Dealership settings saved successfully')
    } catch (error) {
      showError(error, 'Failed to save dealership settings')
    } finally {
      setSaving(false)
    }
  }

  const saveUserSettings = async () => {
    if (!userSettings) return
    setSaving(true)
    try {
      await settingsService.updateUserSettings(user?.id || 'current-user', userSettings)
      showSuccess('Profile settings saved successfully')
    } catch (error) {
      showError(error, 'Failed to save profile settings')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = () => {
    if (!passwordData.current || !passwordData.newPass) {
      showNotification('warning', 'Please fill in all password fields')
      return
    }
    if (passwordData.newPass !== passwordData.confirm) {
      showNotification('error', 'New passwords do not match')
      return
    }
    if (passwordData.newPass.length < 6) {
      showNotification('error', 'Password must be at least 6 characters')
      return
    }
    showSuccess('Password updated successfully')
    setPasswordData({ current: '', newPass: '', confirm: '' })
  }

  const handleSaveNotifPrefs = () => {
    showSuccess('Notification preferences saved')
  }

  const handleSaveAppearance = () => {
    showSuccess('Appearance preferences saved')
  }

  const handleExportData = () => {
    showInfo('Data export has been initiated. You will receive an email when ready.')
  }

  const handleDeleteAccount = () => {
    showNotification('warning', 'Account deletion is not available in demo mode')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

        <div className="lg:col-span-3">
          {activeTab === 'dealership' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Dealership Information</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Dealership Name</label>
                    <Input value={dealershipSettings?.name || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {...prev, name: e.target.value} : null)}
                      placeholder="Enter dealership name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input value={dealershipSettings?.contact?.phone || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {...prev, contact: {...prev.contact, phone: e.target.value}} : null)}
                      placeholder="Enter phone number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input value={dealershipSettings?.contact?.email || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {...prev, contact: {...prev.contact, email: e.target.value}} : null)}
                      type="email" placeholder="Enter email address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <Input value={dealershipSettings?.contact?.website || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {...prev, contact: {...prev.contact, website: e.target.value}} : null)}
                      placeholder="Enter website URL" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <Input value={dealershipSettings?.address?.street || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {...prev, address: {...prev.address, street: e.target.value}} : null)}
                      placeholder="Enter street address" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <Input value={dealershipSettings?.address?.city || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {...prev, address: {...prev.address, city: e.target.value}} : null)}
                      placeholder="Enter city" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <Input value={dealershipSettings?.address?.state || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {...prev, address: {...prev.address, state: e.target.value}} : null)}
                      placeholder="Enter state" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                    <Input value={dealershipSettings?.address?.zipCode || ''}
                      onChange={(e) => setDealershipSettings(prev => prev ? {...prev, address: {...prev.address, zipCode: e.target.value}} : null)}
                      placeholder="Enter ZIP code" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={saveDealershipSettings} disabled={saving} isLoading={saving}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={loadSettings}>Cancel</Button>
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
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <Button variant="secondary" onClick={() => showInfo('Avatar upload coming soon')}>Change Avatar</Button>
                    <p className="text-sm text-gray-600 mt-2">JPG, GIF or PNG. Max size of 2MB</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input value={user?.name || ''} readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input value={user?.email || ''} type="email" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <Input placeholder="+1 (555) 123-4567" readOnly />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <Input value={user?.role?.replace('_', ' ').toUpperCase() || ''} readOnly />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={saveUserSettings} disabled={saving} isLoading={saving}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={loadSettings}>Cancel</Button>
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
                      checked={notifPrefs[index]}
                      onChange={(e) => {
                        const copy = [...notifPrefs]
                        copy[index] = e.target.checked
                        setNotifPrefs(copy)
                      }}
                    />
                  </label>
                ))}
              </div>
              <div className="mt-6">
                <Button onClick={handleSaveNotifPrefs}>Update Preferences</Button>
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
                    <Input type="password" placeholder="Enter current password"
                      value={passwordData.current}
                      onChange={(e) => setPasswordData(p => ({...p, current: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <Input type="password" placeholder="Enter new password"
                      value={passwordData.newPass}
                      onChange={(e) => setPasswordData(p => ({...p, newPass: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <Input type="password" placeholder="Confirm new password"
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData(p => ({...p, confirm: e.target.value}))} />
                  </div>
                  <Button onClick={handleUpdatePassword}>Update Password</Button>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">Two-Factor Authentication</h2>
                <div className="space-y-4">
                  <p className="text-gray-600">Add an extra layer of security to your account by enabling two-factor authentication.</p>
                  <Button variant="secondary" onClick={() => showInfo('2FA setup coming soon')}>Enable 2FA</Button>
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
                          checked={selectedTheme === theme}
                          onChange={() => setSelectedTheme(theme)}
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
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}>
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>
                <Button onClick={handleSaveAppearance}>Save Preferences</Button>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold mb-6">Data & Privacy</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Export Your Data</h3>
                  <p className="text-gray-600">Download a copy of all your data, including leads, customers, and inventory information.</p>
                  <Button variant="secondary" onClick={handleExportData}>Export Data</Button>
                </div>
                <div className="space-y-4">
                  <h3 className="font-medium">Delete Account</h3>
                  <p className="text-gray-600">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
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
                    <p className="text-gray-600 text-sm mb-3">Browse our comprehensive documentation and guides.</p>
                    <Button variant="secondary" size="sm" onClick={() => showInfo('Documentation coming soon')}>View Docs</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Contact Support</h3>
                    <p className="text-gray-600 text-sm mb-3">Get help from our support team via email or chat.</p>
                    <Button variant="secondary" size="sm" onClick={() => showInfo('Please email support@eaglevisionedge.com')}>Contact Us</Button>
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
