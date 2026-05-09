import { useState } from 'react'
import { User, Bell, Shield, Palette, Database, HelpCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/hooks'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'data', label: 'Data & Privacy', icon: Database },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-smooth ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
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
                  <Input
                    label="Full Name"
                    defaultValue={user?.name}
                  />
                  <Input
                    label="Email Address"
                    defaultValue={user?.email}
                    type="email"
                  />
                  <Input
                    label="Phone Number"
                    placeholder="+1 (555) 123-4567"
                  />
                  <Input
                    label="Job Title"
                    defaultValue={user?.role.replace('_', ' ').toUpperCase()}
                  />
                </div>

                <div className="flex gap-3">
                  <Button>Save Changes</Button>
                  <Button variant="secondary">Cancel</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
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
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                      defaultChecked={index < 3}
                    />
                  </label>
                ))}
              </div>
              <div className="mt-6">
                <Button>Update Preferences</Button>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-semibold mb-6">Password</h2>
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                  />
                  <Input
                    label="New Password"
                    type="password"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                  />
                  <Button>Update Password</Button>
                </div>
              </Card>

              <Card>
                <h2 className="text-lg font-semibold mb-6">Two-Factor Authentication</h2>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <Button variant="secondary">Enable 2FA</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <h2 className="text-lg font-semibold mb-6">Appearance</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Light', 'Dark', 'System'].map((theme) => (
                      <label key={theme} className="cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          className="sr-only peer"
                          defaultChecked={theme === 'Light'}
                        />
                        <div className="p-4 border-2 rounded-lg peer-checked:border-primary peer-checked:bg-primary/5">
                          <p className="font-medium text-center">{theme}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-primary mb-3">Language</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <Button>Save Preferences</Button>
              </div>
            </Card>
          )}

          {activeTab === 'data' && (
            <Card>
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
                  <Button variant="accent">Delete Account</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'help' && (
            <Card>
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
                    <p>License: {user?.dealership.name}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}