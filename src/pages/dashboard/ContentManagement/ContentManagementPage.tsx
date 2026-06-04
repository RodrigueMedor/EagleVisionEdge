import { useEffect, useState } from 'react'
import {
  Globe, Home, Info, CreditCard, Car, Mail, Save, RotateCcw, Plus, Trash2, AlertTriangle,
  Package, Gavel, CalendarClock,
} from 'lucide-react'
import { contentService } from '@/services/contentService'
import {
  SiteContent, ContentHero, ContentStat, ContentBenefit, ContentFaq, ContactDepartment,
  AuctionsContent, ScheduleDemoContent, InventoryContent,
} from '@/types/content'
import Button from '@/components/ui/Button'
import ImageUploader from '@/components/ui/ImageUploader'
import { useNotification } from '@/hooks'

type TabId = 'global' | 'home' | 'about' | 'inventory' | 'financing' | 'rentals' | 'auctions' | 'contact' | 'scheduleDemo'

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: Info },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'financing', label: 'Financing', icon: CreditCard },
  { id: 'rentals', label: 'Rentals', icon: Car },
  { id: 'auctions', label: 'Auctions', icon: Gavel },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'scheduleDemo', label: 'Schedule Demo', icon: CalendarClock },
]

interface ArrayItemEditorProps<T> {
  items: T[]
  onChange: (items: T[]) => void
  defaultItem: T
  renderItem: (item: T, index: number, onChange: (val: T) => void) => React.ReactNode
  title: string
}

function ArrayItemEditor<T>({ items, onChange, defaultItem, renderItem, title }: ArrayItemEditorProps<T>) {
  const addItem = () => onChange([...items, { ...defaultItem }])
  const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index))
  const updateItem = (index: number, val: T) => onChange(items.map((item, i) => i === index ? val : item))

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
        <button onClick={addItem} className="text-sm text-accent hover:text-accent/80 flex items-center gap-1">
          <Plus size={14} /> Add
        </button>
      </div>
      {items.map((item, i) => (
        <div key={i} className="p-3 border border-gray-200 rounded-xl bg-gray-50 relative group">
          <button onClick={() => removeItem(i)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 size={14} />
          </button>
          {renderItem(item, i, (val) => updateItem(i, val))}
        </div>
      ))}
    </div>
  )
}

export default function ContentManagementPage() {
  const { success, error: showError } = useNotification()
  const [activeTab, setActiveTab] = useState<TabId>('global')
  const [content, setContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadContent() }, [])

  const loadContent = async () => {
    setLoading(true)
    try {
      const data = await contentService.getContent()
      setContent(data)
    } catch {
      showError('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (section: TabId) => {
    if (!content) return
    setSaving(true)
    try {
      switch (section) {
        case 'global': await contentService.updateGlobal(content.global); break
        case 'home': await contentService.updateHome(content.home); break
        case 'about': await contentService.updateAbout(content.about); break
        case 'inventory': await contentService.updateInventoryContent(content.inventory); break
        case 'financing': await contentService.updateFinancing(content.financing); break
        case 'rentals': await contentService.updateRentals(content.rentals); break
        case 'auctions': await contentService.updateAuctions(content.auctions); break
        case 'contact': await contentService.updateContact(content.contact); break
        case 'scheduleDemo': await contentService.updateScheduleDemo(content.scheduleDemo); break
      }
      success(`${tabs.find(t => t.id === section)?.label} content saved`)
    } catch {
      showError('Failed to save content')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Reset all content to defaults? This cannot be undone.')) return
    try {
      const data = await contentService.resetToDefaults()
      setContent(data)
      success('Content reset to defaults')
    } catch {
      showError('Failed to reset content')
    }
  }

  const updateGlobal = (updates: Partial<SiteContent['global']>) =>
    setContent(prev => prev ? { ...prev, global: { ...prev.global, ...updates } } : prev)

  const updateHome = (updates: Partial<SiteContent['home']>) =>
    setContent(prev => prev ? { ...prev, home: { ...prev.home, ...updates } } : prev)

  const updateAbout = (updates: Partial<SiteContent['about']>) =>
    setContent(prev => prev ? { ...prev, about: { ...prev.about, ...updates } } : prev)

  const updateFinancing = (updates: Partial<SiteContent['financing']>) =>
    setContent(prev => prev ? { ...prev, financing: { ...prev.financing, ...updates } } : prev)

  const updateRentals = (updates: Partial<SiteContent['rentals']>) =>
    setContent(prev => prev ? { ...prev, rentals: { ...prev.rentals, ...updates } } : prev)

  const updateContact = (updates: Partial<SiteContent['contact']>) =>
    setContent(prev => prev ? { ...prev, contact: { ...prev.contact, ...updates } } : prev)

  const updateInventory = (updates: Partial<InventoryContent>) =>
    setContent(prev => prev ? { ...prev, inventory: { ...prev.inventory, ...updates } } : prev)

  const updateAuctions = (updates: Partial<AuctionsContent>) =>
    setContent(prev => prev ? { ...prev, auctions: { ...prev.auctions, ...updates } } : prev)

  const updateScheduleDemo = (updates: Partial<ScheduleDemoContent>) =>
    setContent(prev => prev ? { ...prev, scheduleDemo: { ...prev.scheduleDemo, ...updates } } : prev)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    )
  }

  if (!content) return null

  const renderField = (label: string, value: string, onChange: (v: string) => void, opts?: { multiline?: boolean; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {opts?.multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)}
          className="input-field w-full h-20 resize-none" placeholder={opts?.placeholder} />
      ) : (
        <input type={opts?.type || 'text'} value={value} onChange={e => onChange(e.target.value)}
          className="input-field w-full" placeholder={opts?.placeholder} />
      )}
    </div>
  )

  const renderHeroImage = (value: string, onChange: (v: string) => void) => (
    <ImageUploader value={value} onChange={onChange} label="Hero Background Image" aspectRatio="21/9" />
  )

  const renderHeroFields = (hero: ContentHero, updater: (updates: Partial<ContentHero>) => void) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField('Eyebrow / Subtitle', hero.subtitle, v => updater({ subtitle: v }))}
        {renderField('Main Title', hero.title, v => updater({ title: v }))}
      </div>
      {renderField('Description', hero.description, v => updater({ description: v }), { multiline: true })}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderField('CTA Text', hero.ctaText || '', v => updater({ ctaText: v }))}
        {renderField('CTA Link', hero.ctaLink || '', v => updater({ ctaLink: v }))}
        {renderField('Secondary CTA', hero.secondaryCtaText || '', v => updater({ secondaryCtaText: v }))}
        {renderField('Secondary CTA Link', hero.secondaryCtaLink || '', v => updater({ secondaryCtaLink: v }))}
      </div>
      {renderHeroImage(hero.backgroundImage || '', v => updater({ backgroundImage: v }))}
    </div>
  )

  const renderStatsEditor = (stats: ContentStat[], onChange: (items: ContentStat[]) => void) => (
    <ArrayItemEditor
      title="Stats" items={stats} onChange={onChange}
      defaultItem={{ value: '', label: '' }}
      renderItem={(item, _, onChange) => (
        <div className="grid grid-cols-2 gap-3">
          {renderField('Value', item.value, v => onChange({ ...item, value: v }))}
          {renderField('Label', item.label, v => onChange({ ...item, label: v }))}
        </div>
      )} />
  )

  const renderBenefitsEditor = (benefits: ContentBenefit[], onChange: (items: ContentBenefit[]) => void) => (
    <ArrayItemEditor
      title="Benefits" items={benefits} onChange={onChange}
      defaultItem={{ title: '', description: '' }}
      renderItem={(item, _, onChange) => (
        <div className="grid grid-cols-1 gap-2">
          {renderField('Title', item.title, v => onChange({ ...item, title: v }))}
          {renderField('Description', item.description, v => onChange({ ...item, description: v }), { multiline: true })}
        </div>
      )} />
  )

  const renderTab = () => {
    switch (activeTab) {
      case 'global':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Logo</h3>
              <div className="max-w-xs">
                <ImageUploader
                  value={content.global.logo}
                  onChange={v => updateGlobal({ logo: v })}
                  label="Site Logo"
                  aspectRatio="1/1"
                />
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Dealership Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Dealership Name', content.global.dealershipName, v => updateGlobal({ dealershipName: v }))}
                {renderField('Subtitle', content.global.dealershipSubtitle, v => updateGlobal({ dealershipSubtitle: v }))}
                {renderField('Phone', content.global.phone, v => updateGlobal({ phone: v }))}
                {renderField('Phone (raw for links)', content.global.phoneRaw, v => updateGlobal({ phoneRaw: v }))}
                {renderField('Email', content.global.email, v => updateGlobal({ email: v }))}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Street', content.global.address.street, v => updateGlobal({ address: { ...content.global.address, street: v } }))}
                {renderField('City', content.global.address.city, v => updateGlobal({ address: { ...content.global.address, city: v } }))}
                {renderField('State', content.global.address.state, v => updateGlobal({ address: { ...content.global.address, state: v } }))}
                {renderField('ZIP', content.global.address.zip, v => updateGlobal({ address: { ...content.global.address, zip: v } }))}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Business Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {renderField('Weekday Hours', content.global.businessHours.weekday, v => updateGlobal({ businessHours: { ...content.global.businessHours, weekday: v } }))}
                {renderField('Saturday Hours', content.global.businessHours.saturday, v => updateGlobal({ businessHours: { ...content.global.businessHours, saturday: v } }))}
                {renderField('Sunday Hours', content.global.businessHours.sunday, v => updateGlobal({ businessHours: { ...content.global.businessHours, sunday: v } }))}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Social Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Facebook', content.global.socialMedia.facebook, v => updateGlobal({ socialMedia: { ...content.global.socialMedia, facebook: v } }))}
                {renderField('Instagram', content.global.socialMedia.instagram, v => updateGlobal({ socialMedia: { ...content.global.socialMedia, instagram: v } }))}
                {renderField('Twitter', content.global.socialMedia.twitter, v => updateGlobal({ socialMedia: { ...content.global.socialMedia, twitter: v } }))}
                {renderField('LinkedIn', content.global.socialMedia.linkedin, v => updateGlobal({ socialMedia: { ...content.global.socialMedia, linkedin: v } }))}
                {renderField('YouTube', content.global.socialMedia.youtube, v => updateGlobal({ socialMedia: { ...content.global.socialMedia, youtube: v } }))}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Footer</h3>
              {renderField('Footer Description', content.global.footerDescription, v => updateGlobal({ footerDescription: v }), { multiline: true })}
            </div>
          </div>
        )

      case 'home':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Hero Section</h3>
              {renderHeroFields(content.home.hero, heroUpdates => updateHome({ hero: { ...content.home.hero, ...heroUpdates } }))}
            </div>
            <div className="card p-6">
              {renderStatsEditor(content.home.stats, items => updateHome({ stats: items }))}
            </div>
            <div className="card p-6">
              {renderBenefitsEditor(content.home.benefits, items => updateHome({ benefits: items }))}
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Featured Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Section Title', content.home.featuredSectionTitle, v => updateHome({ featuredSectionTitle: v }))}
                {renderField('Section Description', content.home.featuredSectionDescription, v => updateHome({ featuredSectionDescription: v }), { multiline: true })}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Why Us Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Title', content.home.whyUsTitle, v => updateHome({ whyUsTitle: v }))}
                {renderField('Description', content.home.whyUsDescription, v => updateHome({ whyUsDescription: v }), { multiline: true })}
              </div>
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">CTA Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('CTA Title', content.home.ctaTitle, v => updateHome({ ctaTitle: v }))}
                {renderField('CTA Description', content.home.ctaDescription, v => updateHome({ ctaDescription: v }), { multiline: true })}
              </div>
            </div>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Hero Section</h3>
              {renderHeroFields(content.about.hero, heroUpdates => updateAbout({ hero: { ...content.about.hero, ...heroUpdates } }))}
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Mission & Vision</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Mission Heading', content.about.missionHeading, v => updateAbout({ missionHeading: v }))}
                {renderField('Mission Text', content.about.missionText, v => updateAbout({ missionText: v }), { multiline: true })}
                {renderField('Vision Heading', content.about.visionHeading, v => updateAbout({ visionHeading: v }))}
                {renderField('Vision Text', content.about.visionText, v => updateAbout({ visionText: v }), { multiline: true })}
              </div>
            </div>
            <div className="card p-6">
              <ArrayItemEditor title="Values" items={content.about.values} onChange={items => updateAbout({ values: items })} defaultItem={{ title: '', description: '' }}
                renderItem={(item, _, onChange) => (
                  <div className="grid grid-cols-1 gap-2">
                    {renderField('Title', item.title, v => onChange({ ...item, title: v }))}
                    {renderField('Description', item.description, v => onChange({ ...item, description: v }), { multiline: true })}
                  </div>
                )} />
            </div>
            <div className="card p-6">
              <ArrayItemEditor title="Services" items={content.about.services} onChange={items => updateAbout({ services: items })} defaultItem={{ title: '', description: '' }}
                renderItem={(item, _, onChange) => (
                  <div className="grid grid-cols-1 gap-2">
                    {renderField('Title', item.title, v => onChange({ ...item, title: v }))}
                    {renderField('Description', item.description, v => onChange({ ...item, description: v }), { multiline: true })}
                  </div>
                )} />
            </div>
            <div className="card p-6">
              {renderStatsEditor(content.about.stats, items => updateAbout({ stats: items }))}
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">CTA Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('CTA Title', content.about.ctaTitle, v => updateAbout({ ctaTitle: v }))}
                {renderField('CTA Description', content.about.ctaDescription, v => updateAbout({ ctaDescription: v }), { multiline: true })}
              </div>
            </div>
          </div>
        )

      case 'inventory':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Title', content.inventory.hero.title, v => updateInventory({ hero: { ...content.inventory.hero, title: v } }))}
                {renderField('Subtitle', content.inventory.hero.subtitle, v => updateInventory({ hero: { ...content.inventory.hero, subtitle: v } }))}
              </div>
              <div className="mt-4">
                {renderHeroImage(content.inventory.hero.backgroundImage || '', v => updateInventory({ hero: { ...content.inventory.hero, backgroundImage: v } }))}
              </div>
            </div>
          </div>
        )

      case 'financing':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Hero Section</h3>
              {renderHeroFields(content.financing.hero, heroUpdates => updateFinancing({ hero: { ...content.financing.hero, ...heroUpdates } }))}
            </div>
            <div className="card p-6">
              {renderBenefitsEditor(content.financing.benefits, items => updateFinancing({ benefits: items }))}
            </div>
            <div className="card p-6">
              <ArrayItemEditor title="FAQ" items={content.financing.faq} onChange={items => updateFinancing({ faq: items })} defaultItem={{ question: '', answer: '' }}
                renderItem={(item, _, onChange) => (
                  <div className="grid grid-cols-1 gap-2">
                    {renderField('Question', item.question, v => onChange({ ...item, question: v }))}
                    {renderField('Answer', item.answer, v => onChange({ ...item, answer: v }), { multiline: true })}
                  </div>
                )} />
            </div>
            <div className="card p-6">
              {renderStatsEditor(content.financing.stats, items => updateFinancing({ stats: items }))}
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">CTA Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('CTA Title', content.financing.ctaTitle, v => updateFinancing({ ctaTitle: v }))}
                {renderField('CTA Description', content.financing.ctaDescription, v => updateFinancing({ ctaDescription: v }), { multiline: true })}
              </div>
            </div>
          </div>
        )

      case 'rentals':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Hero Section</h3>
              {renderHeroFields(content.rentals.hero, heroUpdates => updateRentals({ hero: { ...content.rentals.hero, ...heroUpdates } }))}
            </div>
            <div className="card p-6">
              <ArrayItemEditor title="Categories" items={content.rentals.categories} onChange={items => updateRentals({ categories: items })} defaultItem={{ title: '', description: '' }}
                renderItem={(item, _, onChange) => (
                  <div className="grid grid-cols-1 gap-2">
                    {renderField('Title', item.title, v => onChange({ ...item, title: v }))}
                    {renderField('Description', item.description, v => onChange({ ...item, description: v }), { multiline: true })}
                  </div>
                )} />
            </div>
            <div className="card p-6">
              {renderBenefitsEditor(content.rentals.benefits, items => updateRentals({ benefits: items }))}
            </div>
            <div className="card p-6">
              {renderStatsEditor(content.rentals.stats, items => updateRentals({ stats: items }))}
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">CTA Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('CTA Title', content.rentals.ctaTitle, v => updateRentals({ ctaTitle: v }))}
                {renderField('CTA Description', content.rentals.ctaDescription, v => updateRentals({ ctaDescription: v }), { multiline: true })}
              </div>
            </div>
          </div>
        )

      case 'auctions':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Hero Section</h3>
              {renderHeroFields(content.auctions.hero, heroUpdates => updateAuctions({ hero: { ...content.auctions.hero, ...heroUpdates } }))}
            </div>
            <div className="card p-6">
              <ArrayItemEditor title="Features" items={content.auctions.features} onChange={items => updateAuctions({ features: items })} defaultItem={{ title: '', description: '' }}
                renderItem={(item, _, onChange) => (
                  <div className="grid grid-cols-1 gap-2">
                    {renderField('Title', item.title, v => onChange({ ...item, title: v }))}
                    {renderField('Description', item.description, v => onChange({ ...item, description: v }), { multiline: true })}
                  </div>
                )} />
            </div>
            <div className="card p-6">
              {renderStatsEditor(content.auctions.stats, items => updateAuctions({ stats: items }))}
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">CTA Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('CTA Title', content.auctions.ctaTitle, v => updateAuctions({ ctaTitle: v }))}
                {renderField('CTA Description', content.auctions.ctaDescription, v => updateAuctions({ ctaDescription: v }), { multiline: true })}
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField('Title', content.contact.hero.title, v => updateContact({ hero: { ...content.contact.hero, title: v } }))}
                {renderField('Subtitle', content.contact.hero.subtitle, v => updateContact({ hero: { ...content.contact.hero, subtitle: v } }))}
              </div>
            </div>
            <div className="card p-6">
              <ArrayItemEditor title="Departments" items={content.contact.departments} onChange={items => updateContact({ departments: items })} defaultItem={{ name: '', phone: '', availability: '' }}
                renderItem={(item, _, onChange) => (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {renderField('Department Name', item.name, v => onChange({ ...item, name: v }))}
                    {renderField('Phone', item.phone, v => onChange({ ...item, phone: v }))}
                    {renderField('Availability', item.availability, v => onChange({ ...item, availability: v }))}
                  </div>
                )} />
            </div>
          </div>
        )

      case 'scheduleDemo':
        return (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Hero Section</h3>
              <div className="grid grid-cols-1 gap-4">
                {renderField('Title', content.scheduleDemo.hero.title, v => updateScheduleDemo({ hero: { ...content.scheduleDemo.hero, title: v } }))}
                {renderField('Subtitle', content.scheduleDemo.hero.subtitle, v => updateScheduleDemo({ hero: { ...content.scheduleDemo.hero, subtitle: v } }))}
                {renderField('Description', content.scheduleDemo.hero.description, v => updateScheduleDemo({ hero: { ...content.scheduleDemo.hero, description: v } }), { multiline: true })}
              </div>
              <div className="mt-4">
                {renderHeroImage(content.scheduleDemo.hero.backgroundImage || '', v => updateScheduleDemo({ hero: { ...content.scheduleDemo.hero, backgroundImage: v } }))}
              </div>
            </div>
            <div className="card p-6">
              {renderBenefitsEditor(content.scheduleDemo.benefits, items => updateScheduleDemo({ benefits: items }))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Content Management</h1>
          <p className="text-gray-600 mt-1">Edit site-wide content & images for all public pages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" /> Reset Defaults
          </Button>
          <Button variant="primary" onClick={() => handleSave(activeTab)} disabled={saving}>
            <Save className="w-4 h-4 mr-2" /> {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-accent text-accent'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-500 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
        <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
        <span>Changes are saved to localStorage and will persist across page reloads. Click <strong>Save</strong> after editing each section. Drag & drop or click to upload images. All public pages will reflect changes immediately.</span>
      </div>

      <div className="animate-fadeInUp">
        {renderTab()}
      </div>
    </div>
  )
}
