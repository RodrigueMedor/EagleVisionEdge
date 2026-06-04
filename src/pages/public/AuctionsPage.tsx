import { Car, Calendar, Gavel, TrendingUp } from 'lucide-react'
import HeroSection from '@/components/ui/HeroSection'
import SectionHeader from '@/components/ui/SectionHeader'
import FeatureCard from '@/components/ui/FeatureCard'
import CTASection from '@/components/ui/CTASection'
import Button from '@/components/ui/Button'

export default function AuctionsPage() {
  const features = [
    { icon: Gavel, title: 'Live Bidding', description: 'Participate in real-time live auctions from the comfort of your home or dealership.', variant: 'default' as const },
    { icon: Calendar, title: 'Scheduled Events', description: 'Browse upcoming auction events and register early for the best selection.', variant: 'default' as const },
    { icon: Car, title: 'Curated Inventory', description: 'Access a handpicked selection of vehicles vetted for quality and value.', variant: 'default' as const },
    { icon: TrendingUp, title: 'Market Pricing', description: 'Get real-time market insights and pricing data to make informed bids.', variant: 'default' as const },
  ]

  return (
    <div className="min-h-screen">
      <HeroSection
        title="Vehicle Auctions"
        subtitle="Coming Soon"
        description="Our online auction platform is under development. Register your interest to be notified when we launch."
      >
        <Button variant="secondary" className="bg-white/10 text-white border-white/20 hover:bg-white/20 rounded-2xl">
          Notify Me When Live
        </Button>
      </HeroSection>

      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Coming Features"
            title="What to Expect"
            description="Our auction platform will bring a modern, transparent bidding experience to independent dealers."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-12">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Stay Updated"
        description="Be the first to know when our auction platform goes live with early access opportunities."
        background="primary"
      >
        <button className="inline-flex items-center gap-2 bg-accent hover:bg-red-700 text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-200 hover:shadow-xl active:scale-[0.97]">
          Join Waitlist
        </button>
      </CTASection>
    </div>
  )
}
