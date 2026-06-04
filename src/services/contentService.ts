import { SiteContent, ContentStat, ContentBenefit, ContentFaq, ContactDepartment, AuctionsContent, ScheduleDemoContent } from '@/types/content'
import { defaultSiteContent } from '@/data/defaultContent'

const STORAGE_KEY = 'eagle_vision_site_content'

const loadFromStorage = (): SiteContent => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return defaultSiteContent
}

const saveToStorage = (data: SiteContent): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

let cachedContent: SiteContent = loadFromStorage()

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms))

export const contentService = {
  async getContent(): Promise<SiteContent> {
    await delay(150)
    cachedContent = loadFromStorage()
    return { ...cachedContent }
  },

  async updateGlobal(updates: Partial<SiteContent['global']>): Promise<SiteContent['global']> {
    await delay(200)
    cachedContent.global = { ...cachedContent.global, ...updates }
    saveToStorage(cachedContent)
    return { ...cachedContent.global }
  },

  async updateHome(updates: Partial<SiteContent['home']>): Promise<SiteContent['home']> {
    await delay(200)
    cachedContent.home = { ...cachedContent.home, ...updates }
    saveToStorage(cachedContent)
    return { ...cachedContent.home }
  },

  async updateAbout(updates: Partial<SiteContent['about']>): Promise<SiteContent['about']> {
    await delay(200)
    cachedContent.about = { ...cachedContent.about, ...updates }
    saveToStorage(cachedContent)
    return { ...cachedContent.about }
  },

  async updateFinancing(updates: Partial<SiteContent['financing']>): Promise<SiteContent['financing']> {
    await delay(200)
    cachedContent.financing = { ...cachedContent.financing, ...updates }
    saveToStorage(cachedContent)
    return { ...cachedContent.financing }
  },

  async updateRentals(updates: Partial<SiteContent['rentals']>): Promise<SiteContent['rentals']> {
    await delay(200)
    cachedContent.rentals = { ...cachedContent.rentals, ...updates }
    saveToStorage(cachedContent)
    return { ...cachedContent.rentals }
  },

  async updateContact(updates: Partial<SiteContent['contact']>): Promise<SiteContent['contact']> {
    await delay(200)
    cachedContent.contact = { ...cachedContent.contact, ...updates }
    saveToStorage(cachedContent)
    return { ...cachedContent.contact }
  },

  async updateInventory(updates: Partial<SiteContent['inventory']>): Promise<SiteContent['inventory']> {
    await delay(200)
    cachedContent.inventory = { ...cachedContent.inventory, ...updates }
    saveToStorage(cachedContent)
    return { ...cachedContent.inventory }
  },

  async updateAuctions(updates: Partial<AuctionsContent>): Promise<AuctionsContent> {
    await delay(200)
    cachedContent.auctions = { ...cachedContent.auctions, ...updates }
    saveToStorage(cachedContent)
    return { ...cachedContent.auctions }
  },

  async updateScheduleDemo(updates: Partial<ScheduleDemoContent>): Promise<ScheduleDemoContent> {
    await delay(200)
    cachedContent.scheduleDemo = { ...cachedContent.scheduleDemo, ...updates }
    saveToStorage(cachedContent)
    return { ...cachedContent.scheduleDemo }
  },

  async updateInventoryContent(updates: Partial<SiteContent['inventory']>): Promise<SiteContent['inventory']> {
    await delay(200)
    cachedContent.inventory = { ...cachedContent.inventory, ...updates }
    saveToStorage(cachedContent)
    return { ...cachedContent.inventory }
  },

  async resetToDefaults(): Promise<SiteContent> {
    await delay(300)
    cachedContent = { ...defaultSiteContent }
    saveToStorage(cachedContent)
    return { ...cachedContent }
  },

  async updateHomeBenefits(benefits: ContentBenefit[]): Promise<ContentBenefit[]> {
    await delay(200)
    cachedContent.home.benefits = benefits
    saveToStorage(cachedContent)
    return [...benefits]
  },

  async updateHomeStats(stats: ContentStat[]): Promise<ContentStat[]> {
    await delay(200)
    cachedContent.home.stats = stats
    saveToStorage(cachedContent)
    return [...stats]
  },

  async updateAboutStats(stats: ContentStat[]): Promise<ContentStat[]> {
    await delay(200)
    cachedContent.about.stats = stats
    saveToStorage(cachedContent)
    return [...stats]
  },

  async updateFinancingFaq(faq: ContentFaq[]): Promise<ContentFaq[]> {
    await delay(200)
    cachedContent.financing.faq = faq
    saveToStorage(cachedContent)
    return [...faq]
  },

  async updateFinancingStats(stats: ContentStat[]): Promise<ContentStat[]> {
    await delay(200)
    cachedContent.financing.stats = stats
    saveToStorage(cachedContent)
    return [...stats]
  },

  async updateRentalsStats(stats: ContentStat[]): Promise<ContentStat[]> {
    await delay(200)
    cachedContent.rentals.stats = stats
    saveToStorage(cachedContent)
    return [...stats]
  },

  async updateContactDepartments(departments: ContactDepartment[]): Promise<ContactDepartment[]> {
    await delay(200)
    cachedContent.contact.departments = departments
    saveToStorage(cachedContent)
    return [...departments]
  },
}
