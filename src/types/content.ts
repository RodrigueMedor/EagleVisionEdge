export interface ContentHero {
  title: string
  subtitle: string
  description: string
  ctaText?: string
  ctaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  backgroundImage?: string
}

export interface ContentStat {
  value: string
  label: string
  suffix?: string
}

export interface ContentBenefit {
  title: string
  description: string
  accent?: boolean
}

export interface ContentFaq {
  question: string
  answer: string
}

export interface SocialLinks {
  facebook: string
  instagram: string
  twitter: string
  linkedin: string
  youtube: string
}

export interface BusinessHours {
  weekday: string
  saturday: string
  sunday: string
}

export interface ContactDepartment {
  name: string
  phone: string
  availability: string
}

export interface GlobalContent {
  dealershipName: string
  dealershipSubtitle: string
  phone: string
  phoneRaw: string
  email: string
  address: { street: string; city: string; state: string; zip: string }
  businessHours: BusinessHours
  socialMedia: SocialLinks
  logo: string
  footerDescription: string
}

export interface HomeContent {
  hero: ContentHero
  stats: ContentStat[]
  benefits: ContentBenefit[]
  featuredSectionTitle: string
  featuredSectionDescription: string
  whyUsTitle: string
  whyUsDescription: string
  ctaTitle: string
  ctaDescription: string
}

export interface AboutContent {
  hero: ContentHero
  missionHeading: string
  missionText: string
  visionHeading: string
  visionText: string
  values: ContentBenefit[]
  services: ContentBenefit[]
  whyChoose: ContentBenefit[]
  stats: ContentStat[]
  ctaTitle: string
  ctaDescription: string
}

export interface FinancingContent {
  hero: ContentHero
  benefits: ContentBenefit[]
  faq: ContentFaq[]
  stats: ContentStat[]
  ctaTitle: string
  ctaDescription: string
}

export interface RentalsContent {
  hero: ContentHero
  categories: ContentBenefit[]
  benefits: ContentBenefit[]
  stats: ContentStat[]
  ctaTitle: string
  ctaDescription: string
}

export interface ContactContent {
  hero: { title: string; subtitle: string }
  departments: ContactDepartment[]
}

export interface InventoryContent {
  hero: { title: string; subtitle: string; backgroundImage?: string }
}

export interface AuctionsContent {
  hero: ContentHero
  features: ContentBenefit[]
  stats: ContentStat[]
  ctaTitle: string
  ctaDescription: string
}

export interface ScheduleDemoContent {
  hero: { title: string; subtitle: string; description: string; backgroundImage?: string }
  benefits: ContentBenefit[]
}

export interface SiteContent {
  global: GlobalContent
  home: HomeContent
  about: AboutContent
  financing: FinancingContent
  rentals: RentalsContent
  contact: ContactContent
  inventory: InventoryContent
  auctions: AuctionsContent
  scheduleDemo: ScheduleDemoContent
}
