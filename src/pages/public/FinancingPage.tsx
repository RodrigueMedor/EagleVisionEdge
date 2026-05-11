import HeroSection from '@/components/ui/HeroSection'
import SectionHeader from '@/components/ui/SectionHeader'
import BenefitCard from '@/components/ui/BenefitCard'
import FAQAccordion from '@/components/ui/FAQAccordion'
import CTASection from '@/components/ui/CTASection'
import FinancingForm from '@/components/financing/FinancingForm'
import FinancingCalculator from '@/components/financing/FinancingCalculator'
import FinancingModal from '@/components/financing/FinancingModal'
import SuccessModal from '@/components/financing/SuccessModal'
import ContactModal from '@/components/financing/ContactModal'
import FinancingCTASection, { ConsultationModal, PhoneNumberDisplay } from '@/components/financing/FinancingCTASection'
import Button from '@/components/ui/Button'
import { ToastContainer } from '@/components/ui/Toast'
import { useModal } from '@/hooks/useFinancing'
import { useToast } from '@/hooks/useFinancing'
import { 
  CreditCard, 
  DollarSign, 
  Shield, 
  TrendingUp,
  CheckCircle,
  Star,
  Users,
  Clock,
  Phone
} from 'lucide-react'

export default function FinancingPage() {
  const financingModal = useModal()
  const successModal = useModal()
  const consultationModal = useModal()
  const contactModal = useModal()
  const { toasts, removeToast, showInfo } = useToast()

  const handleFinancingSuccess = (applicationId?: string) => {
    financingModal.closeModal()
    successModal.openModal()
  }

  const handleNewApplication = () => {
    successModal.closeModal()
    financingModal.openModal()
  }

  const financingBenefits = [
    {
      icon: CreditCard,
      title: 'Bad Credit Financing',
      description: 'We work with all credit scores. Our financing experts can help you get approved regardless of your credit history.',
      accent: true
    },
    {
      icon: Users,
      title: 'First-Time Buyer Support',
      description: 'Special programs for first-time car buyers with competitive rates and flexible terms designed for your situation.',
      accent: false
    },
    {
      icon: DollarSign,
      title: 'Flexible Payment Plans',
      description: 'Choose from various loan terms and payment schedules that fit your budget and lifestyle needs.',
      accent: false
    },
    {
      icon: TrendingUp,
      title: 'Trade-In Assistance',
      description: 'Get top value for your current vehicle with our hassle-free trade-in process and instant appraisal.',
      accent: true
    }
  ]

  const faqItems = [
    {
      question: 'Do you finance bad credit?',
      answer: 'Yes! We specialize in helping customers with all credit types, including bad credit, no credit, and first-time buyers. We have relationships with multiple lenders to find the best financing options for your situation.'
    },
    {
      question: 'How much down payment is required?',
      answer: 'Down payment requirements vary based on credit score, vehicle price, and lender requirements. We offer programs with as little as $0 down for qualified buyers. Our team will work to find the best option for your budget.'
    },
    {
      question: 'Can I apply online?',
      answer: 'Absolutely! You can complete our secure online financing application in minutes. Our team will review your application and contact you within 24 hours with your approval status and next steps.'
    },
    {
      question: 'Do you accept trade-ins?',
      answer: 'Yes, we accept all trade-ins regardless of condition. We offer competitive market values and can apply your trade-in equity directly to your down payment, potentially reducing your monthly payments.'
    },
    {
      question: 'What interest rates can I expect?',
      answer: 'Interest rates vary based on your credit score, loan term, vehicle age, and other factors. Our rates start as low as 2.9% for qualified buyers. We shop multiple lenders to ensure you get the best possible rate.'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Toast Container */}
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Hero Section */}
      <HeroSection
        title="Flexible Financing Options For Every Customer"
        subtitle="Drive Your Dream Car Today"
        description="We make car financing simple, fast, and accessible. Get approved in minutes with our competitive rates and flexible terms."
      >
        <FinancingCTASection
          onApplyNow={() => financingModal.openModal()}
          onGetPreApproved={() => financingModal.openModal()}
          onScheduleConsultation={() => consultationModal.openModal()}
          onContactTeam={() => contactModal.openModal()}
        />
      </HeroSection>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Why Choose Our Financing?"
            description="We make financing easy with competitive rates, flexible terms, and expert guidance every step of the way."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {financingBenefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                accent={benefit.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Financing Calculator and Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Calculate Your Payment & Apply"
            description="Use our payment calculator to estimate your monthly payments, then complete our simple application to get approved."
          />
          <div className="grid lg:grid-cols-2 gap-12">
            <FinancingCalculator />
            <div>
              <h3 className="text-2xl font-bold text-primary mb-6">Financing Application</h3>
              <FinancingForm onSuccess={handleFinancingSuccess} />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-gray-200">Approval Rate</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">15min</div>
              <div className="text-gray-200">Average Response Time</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">2.9%</div>
              <div className="text-gray-200">Starting APR</div>
            </div>
            <div className="text-white">
              <div className="text-4xl font-bold mb-2">$0</div>
              <div className="text-gray-200">Application Fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Frequently Asked Questions"
            subtitle="Got questions? We've got answers."
            description="Find answers to common questions about our financing process, requirements, and approval timeline."
          />
          <FAQAccordion items={faqItems} />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready to Get Approved?"
        description="Take the first step towards driving your dream car. Apply now and get approved in minutes, not days."
      >
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Button 
            variant="secondary" 
            size="lg" 
            className="bg-white text-primary hover:bg-gray-100"
            onClick={() => financingModal.openModal()}
          >
            Apply Now
          </Button>
          <Button 
            variant="accent" 
            size="lg" 
            className="border-2 border-white"
            onClick={() => consultationModal.openModal()}
          >
            Schedule Consultation
          </Button>
          <Button 
            variant="ghost" 
            size="lg"
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
            onClick={() => {
              window.open('tel:5551234567', '_self')
              showInfo('Call Us', 'Please call (555) 123-4567 to speak with our financing team.')
            }}
          >
            <Phone className="w-4 h-4 mr-2" />
            <span className="font-semibold">(555) 123-4567</span>
          </Button>
        </div>
      </CTASection>

      {/* Modals */}
      <FinancingModal
        isOpen={financingModal.isOpen}
        onClose={financingModal.closeModal}
        onSuccess={handleFinancingSuccess}
      />

      <SuccessModal
        isOpen={successModal.isOpen}
        onClose={successModal.closeModal}
        onNewApplication={handleNewApplication}
      />

      <ConsultationModal
        isOpen={consultationModal.isOpen}
        onClose={consultationModal.closeModal}
      />

      <ContactModal
        isOpen={contactModal.isOpen}
        onClose={contactModal.closeModal}
      />
    </div>
  )
}
