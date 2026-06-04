import HeroSection from '@/components/ui/HeroSection'
import SectionHeader from '@/components/ui/SectionHeader'
import FeatureCard from '@/components/ui/FeatureCard'
import CTASection from '@/components/ui/CTASection'
import Button from '@/components/ui/Button'
import { 
  Target, 
  Eye, 
  Lightbulb, 
  Users,
  Cpu,
  Smartphone,
  Cloud,
  BarChart3,
  Car,
  TrendingUp,
  Shield,
  Award,
  User
} from 'lucide-react'
import { useState } from 'react'
import ScheduleDemoModal from '@/components/demo/ScheduleDemoModal'

export default function AboutPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const missionValues = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We constantly push the boundaries of what\'s possible in dealership technology, bringing cutting-edge solutions to independent dealers.'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Open communication, honest pricing, and clear processes build the trust that forms the foundation of our client relationships.'
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Our clients\' success is our success. We\'re obsessed with creating solutions that solve real-world dealership challenges.'
    },
    {
      icon: TrendingUp,
      title: 'Operational Excellence',
      description: 'We deliver reliable, scalable solutions that streamline operations and drive measurable business growth for our dealership partners.'
    }
  ]

  const services = [
    {
      icon: Car,
      title: 'Inventory Management',
      description: 'Streamlined vehicle inventory tracking, automated listings, and intelligent stock management to maximize turnover.'
    },
    {
      icon: Smartphone,
      title: 'Dealership Websites',
      description: 'Modern, mobile-first dealership websites with integrated inventory, lead capture, and customer engagement tools.'
    },
    {
      icon: Users,
      title: 'CRM & Lead Management',
      description: 'Comprehensive customer relationship management with automated lead nurturing and sales pipeline optimization.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Real-time insights into sales performance, customer behavior, and market trends to drive data-informed decisions.'
    },
    {
      icon: Cloud,
      title: 'Cloud Infrastructure',
      description: 'Secure, scalable cloud solutions that ensure your dealership operations are always accessible and reliable.'
    },
    {
      icon: Cpu,
      title: 'AI Automation',
      description: 'Coming soon: Advanced AI-powered automation for customer service, lead scoring, and operational efficiency.'
    }
  ]

  const whyChooseUs = [
    {
      icon: Cpu,
      title: 'Modern Technology Stack',
      description: 'Built with the latest technologies ensuring scalability, security, and future-ready capabilities for growing dealerships.'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Every solution is optimized for mobile devices, reflecting how today\'s customers research and purchase vehicles.'
    },
    {
      icon: Cloud,
      title: 'Cloud-Ready Systems',
      description: 'Our cloud-native architecture ensures reliability, automatic updates, and seamless scaling as your business grows.'
    },
    {
      icon: Target,
      title: 'Dealership-Focused Workflows',
      description: 'Every feature is designed specifically for dealership operations, addressing real pain points and workflow needs.'
    },
    {
      icon: TrendingUp,
      title: 'Scalable Solutions',
      description: 'From single-location dealerships to multi-location groups, our platform grows with your business needs.'
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Join hundreds of dealerships who have transformed their operations and increased profitability with our platform.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Modern Technology Solutions For Independent Dealerships"
        subtitle="Empowering Dealerships to Thrive in the Digital Age"
        description="Eagle Vision Edge is transforming independent dealerships with cutting-edge technology that drives efficiency, increases sales, and enhances customer experiences."
        image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=800&fit=crop"
      >
        <Button 
          variant="secondary" 
          size="lg" 
          className="bg-white text-primary hover:bg-gray-100"
          onClick={() => setIsModalOpen(true)}
        >
          Schedule Demo
        </Button>
        <Button variant="accent" size="lg" className="border-2 border-white">
          Learn More
        </Button>
      </HeroSection>

      {/* Company Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Story"
            description="From a vision to revolutionize dealership operations to a trusted technology partner for hundreds of independent dealers."
          />
          <div className="prose prose-lg max-w-none">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Eagle Vision Edge was born from a simple observation: independent dealerships were being left behind in the digital revolution. While large dealership groups had access to sophisticated technology and tools, independent dealers struggled with fragmented systems, manual processes, and outdated software.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our founders, with deep experience in both automotive retail and enterprise technology, saw an opportunity to level the playing field. We envisioned a platform that would bring enterprise-grade technology to independent dealerships, designed specifically for their unique needs and workflows.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Today, Eagle Vision Edge powers hundreds of dealerships across the country, helping them compete effectively, operate more efficiently, and deliver exceptional customer experiences. Our commitment to innovation, transparency, and customer success remains at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Mission & Vision"
            description="Guiding principles that drive our commitment to dealership success."
          />
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-8 text-white">
              <Target className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-200 leading-relaxed">
                To empower independent dealerships with modern, intuitive technology that drives operational excellence, increases profitability, and enables them to compete effectively in an increasingly digital marketplace.
              </p>
            </div>
            <div className="bg-gradient-to-br from-accent to-red-700 rounded-xl p-8 text-white">
              <Eye className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-200 leading-relaxed">
                To become the trusted technology partner for every independent dealership, creating a future where technology seamlessly enhances every aspect of dealership operations and customer experiences.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {missionValues.map((value, index) => (
              <FeatureCard
                key={index}
                icon={value.icon}
                title={value.title}
                description={value.description}
                variant="gradient"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Services"
            description="Comprehensive solutions designed to transform every aspect of your dealership operations."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <FeatureCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                variant="default"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Choose Eagle Vision Edge?"
            description="Discover what sets us apart and makes us the ideal technology partner for your dealership."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((reason, index) => (
              <FeatureCard
                key={index}
                icon={reason.icon}
                title={reason.title}
                description={reason.description}
                variant="bordered"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Team/Founder Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Leadership"
            description="Passionate experts committed to transforming dealership operations through technology."
          />
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-16 h-16 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-2">Leadership Team</h3>
                <p className="text-gray-600 mb-4">
                  Our leadership team brings together decades of experience in automotive retail, enterprise technology, and business growth. We understand the challenges independent dealerships face because we've lived them.
                </p>
                <p className="text-gray-600">
                  We're not just technology providers – we're partners in your success. Our team is passionate about creating solutions that make a real difference in dealership operations and customer experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-200">Dealerships Served</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-gray-200">Vehicles Managed</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-gray-200">Uptime</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-200">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready To Modernize Your Dealership?"
        description="Join hundreds of independent dealerships who have transformed their operations with Eagle Vision Edge. Schedule your personalized demo today."
      >
        <Button 
          variant="secondary" 
          size="lg" 
          className="bg-white text-primary hover:bg-gray-100"
          onClick={() => setIsModalOpen(true)}
        >
          Schedule Demo
        </Button>
        <Button variant="accent" size="lg" className="border-2 border-white">
          Contact Sales
        </Button>
      </CTASection>

      {/* Schedule Demo Modal */}
      {isModalOpen && (
        <ScheduleDemoModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}
