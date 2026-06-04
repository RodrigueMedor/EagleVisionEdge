import { SiteContent } from '@/types/content'

export const defaultSiteContent: SiteContent = {
  global: {
    dealershipName: 'Eagle Vision Edge',
    dealershipSubtitle: 'Dealership Operations Platform',
    phone: '(305) 555-0100',
    phoneRaw: '+13055550100',
    email: 'info@eaglevisionedge.com',
    address: { street: '1234 Business Highway', city: 'Miami', state: 'FL', zip: '33101' },
    businessHours: {
      weekday: 'Mon-Fri: 9:00 AM - 7:00 PM',
      saturday: 'Sat: 9:00 AM - 5:00 PM',
      sunday: 'Sun: Closed',
    },
    socialMedia: {
      facebook: 'https://facebook.com/eaglevisionedge',
      instagram: 'https://instagram.com/eaglevisionedge',
      twitter: 'https://twitter.com/eaglevisionedge',
      linkedin: 'https://linkedin.com/company/eaglevisionedge',
      youtube: 'https://youtube.com/eaglevisionedge',
    },
    logo: '',
    footerDescription:
      'Premium auto dealership management platform providing quality vehicles, flexible financing, and exceptional customer service across Florida.',
  },
  home: {
    hero: {
      title: 'Perfect Vehicle',
      subtitle: 'Find Your',
      description:
        'Quality vehicles, competitive prices, and exceptional service — your trusted dealership partner in South Florida.',
      ctaText: 'Browse Inventory',
      ctaLink: '/inventory',
      secondaryCtaText: 'Schedule Test Drive',
      secondaryCtaLink: '/schedule-demo',
      backgroundImage: '',
    },
    stats: [
      { value: '500+', label: 'Vehicles in Stock' },
      { value: '4.8', label: 'Customer Rating', suffix: '★' },
      { value: '10+', label: 'Years in Business' },
    ],
    benefits: [
      { title: 'Quality Assurance', description: 'All vehicles undergo rigorous 150-point inspection and reconditioning' },
      { title: 'Competitive Pricing', description: 'Fair market prices with zero hidden fees or surprise charges' },
      { title: 'Quick Approval', description: 'Fast financing decisions with competitive rates in minutes' },
      { title: 'Expert Service', description: 'Knowledgeable staff dedicated to your complete satisfaction' },
    ],
    featuredSectionTitle: 'Featured Vehicles',
    featuredSectionDescription: 'Handpicked selection of quality vehicles ready for test drive',
    whyUsTitle: 'Why Eagle Vision Edge',
    whyUsDescription: 'We are committed to providing the best car buying experience with transparency and quality',
    ctaTitle: 'Ready to Find Your Dream Car',
    ctaDescription: 'Visit us today or schedule a test drive online — our team is ready to help you drive away happy',
  },
  about: {
    hero: {
      title: 'Modern Technology Solutions For Independent Dealerships',
      subtitle: 'Empowering Dealerships to Thrive in the Digital Age',
      description:
        'Eagle Vision Edge is transforming independent dealerships with cutting-edge technology that drives efficiency, increases sales, and enhances customer experiences.',
      backgroundImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=800&fit=crop',
      ctaText: 'Schedule Demo',
      ctaLink: '/schedule-demo',
      secondaryCtaText: 'Learn More',
    },
    missionHeading: 'Our Mission',
    missionText:
      'To empower independent dealerships with innovative technology solutions that streamline operations, enhance customer experiences, and drive sustainable growth in the digital age.',
    visionHeading: 'Our Vision',
    visionText:
      'To become the leading technology partner for independent dealerships worldwide, setting the standard for operational excellence and customer satisfaction in the automotive industry.',
    values: [
      { title: 'Innovation', description: 'Continuously pushing boundaries to develop cutting-edge solutions that keep our clients ahead of the competition.' },
      { title: 'Transparency', description: 'Maintaining open communication and honest practices in everything we do, from pricing to support.' },
      { title: 'Customer Focus', description: 'Putting our clients first by understanding their unique needs and delivering tailored solutions.' },
      { title: 'Operational Excellence', description: 'Striving for the highest standards in quality, reliability, and performance across all our products.' },
    ],
    services: [
      { title: 'Inventory Management', description: 'Comprehensive tools to track, manage, and showcase your inventory across multiple channels.' },
      { title: 'Dealership Websites', description: 'Modern, mobile-responsive websites designed to convert visitors into customers.' },
      { title: 'CRM & Lead Management', description: 'Powerful customer relationship management to track and nurture leads effectively.' },
      { title: 'Analytics & Reporting', description: 'Data-driven insights to help you make informed business decisions.' },
      { title: 'Cloud Infrastructure', description: 'Scalable, secure cloud solutions that grow with your dealership.' },
      { title: 'AI Automation', description: 'Coming soon — intelligent automation to streamline your dealership operations.' },
    ],
    whyChoose: [
      { title: 'Modern Technology Stack', description: 'Built with the latest technologies to ensure performance, security, and scalability.' },
      { title: 'Mobile-First Design', description: 'Responsive designs that work seamlessly across all devices and screen sizes.' },
      { title: 'Cloud-Ready Systems', description: 'Deploy anywhere with our cloud-native architecture and flexible hosting options.' },
      { title: 'Dealership-Focused Workflows', description: 'Purpose-built for automotive retail with industry-specific features.' },
      { title: 'Scalable Solutions', description: 'From small lots to large dealerships, our solutions grow with your business.' },
      { title: 'Proven Results', description: 'Real dealerships achieving real results with our technology platform.' },
    ],
    stats: [
      { value: '500+', label: 'Dealerships Served' },
      { value: '50K+', label: 'Vehicles Managed' },
      { value: '99.9%', label: 'Uptime' },
      { value: '24/7', label: 'Support' },
    ],
    ctaTitle: 'Ready To Modernize Your Dealership?',
    ctaDescription:
      'Join hundreds of independent dealerships who have transformed their operations with Eagle Vision Edge. Schedule your personalized demo today.',
  },
  financing: {
    hero: {
      title: 'Flexible Financing Options For Every Customer',
      subtitle: 'Drive Your Dream Car Today',
      description: 'We make car financing simple, fast, and accessible. Get approved in minutes with our competitive rates and flexible terms.',
      backgroundImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=800&fit=crop',
      ctaText: 'Apply Now',
      ctaLink: '#apply',
      secondaryCtaText: 'Schedule Consultation',
      secondaryCtaLink: '/schedule-demo',
    },
    benefits: [
      { title: 'Bad Credit Financing', description: 'We work with customers of all credit backgrounds to find financing solutions that work for you.', accent: true },
      { title: 'First-Time Buyer Support', description: 'Special programs and guidance for first-time car buyers navigating the financing process.', accent: false },
      { title: 'Flexible Payment Plans', description: 'Choose from a variety of loan terms and payment structures that fit your budget.', accent: false },
      { title: 'Trade-In Assistance', description: 'Get maximum value for your trade-in and apply it directly to your down payment.', accent: true },
    ],
    faq: [
      { question: 'Do you finance bad credit?', answer: 'Yes! We work with customers across all credit spectrums. Our team specializes in finding financing solutions for customers with less-than-perfect credit.' },
      { question: 'How much down payment is required?', answer: 'Down payment requirements vary by lender and credit profile, but we offer options with as little as $0 down for qualified buyers.' },
      { question: 'Can I apply online?', answer: 'Absolutely! Our online application takes just minutes to complete, and you can get a decision quickly.' },
      { question: 'Do you accept trade-ins?', answer: 'Yes, we accept trade-ins and offer competitive valuations. We can apply the trade-in value toward your down payment.' },
      { question: 'What interest rates can I expect?', answer: 'Interest rates vary based on credit score, loan term, and vehicle. Our team will work to find you the best available rate.' },
    ],
    stats: [
      { value: '98%', label: 'Approval Rate' },
      { value: '15min', label: 'Average Response Time' },
      { value: '2.9%', label: 'Starting APR' },
      { value: '$0', label: 'Application Fee' },
    ],
    ctaTitle: 'Ready to Get Approved?',
    ctaDescription:
      'Take the first step towards driving your dream car. Apply now and get approved in minutes, not days.',
  },
  rentals: {
    hero: {
      title: 'Reliable Vehicle Rental Solutions',
      subtitle: 'Uber & Cargo Van Rentals Available',
      description: 'Professional vehicle rentals for personal, business, and rideshare needs. Flexible terms, competitive rates, and quality vehicles ready when you are.',
      backgroundImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=800&fit=crop',
      ctaText: 'Reserve Vehicle',
      ctaLink: '#inquiry',
      secondaryCtaText: 'Contact Us',
      secondaryCtaLink: '/contact',
    },
    categories: [
      { title: 'Uber Rentals', description: 'Rent reliable vehicles ready for rideshare driving. Perfect for Uber, Lyft, and other platforms.', accent: true },
      { title: 'Cargo Van Rentals', description: 'Spacious cargo vans for moving, deliveries, and business transportation needs.', accent: false },
      { title: 'Daily Rentals', description: 'Short-term daily rentals for personal use, errands, and weekend getaways.', accent: false },
      { title: 'Commercial Fleet', description: 'Long-term fleet solutions for businesses with ongoing vehicle needs.', accent: true },
    ],
    benefits: [
      { title: 'Affordable Rates', description: 'Competitive daily, weekly, and monthly rates with no hidden fees.', accent: false },
      { title: 'Flexible Rental Periods', description: 'Rent by the day, week, or month with customizable terms.', accent: true },
      { title: 'Business Fleet Support', description: 'Dedicated support for commercial accounts and fleet management.', accent: false },
      { title: 'Ride-Share Ready', description: 'Vehicles specifically prepared for rideshare driving requirements.', accent: true },
    ],
    stats: [
      { value: '150+', label: 'Vehicle Fleet' },
      { value: '24/7', label: 'Roadside Assistance' },
      { value: '98%', label: 'Customer Satisfaction' },
      { value: '5min', label: 'Average Pickup Time' },
    ],
    ctaTitle: 'Ready to Reserve Your Vehicle?',
    ctaDescription:
      'Get on the road today with our quick and easy rental process. Quality vehicles, competitive rates, and exceptional service.',
  },
  contact: {
    hero: { title: 'Contact Us', subtitle: 'Get in touch with our team for any questions or to schedule a visit' },
    departments: [
      { name: 'Sales Department', phone: '(305) 555-0100', availability: 'Available Monday - Saturday' },
      { name: 'Service Department', phone: '(305) 555-0101', availability: 'Available Monday - Friday' },
    ],
  },
  inventory: {
    hero: { title: 'Vehicle Inventory', subtitle: 'Browse our selection of quality vehicles', backgroundImage: '' },
  },
  auctions: {
    hero: {
      title: 'Vehicle Auctions',
      subtitle: 'Coming Soon',
      description: 'Our online auction platform is under development. Register your interest to be notified when we launch.',
      backgroundImage: '',
      ctaText: 'Notify Me When Live',
      ctaLink: '#notify',
    },
    features: [
      { title: 'Live Bidding', description: 'Participate in real-time live auctions from the comfort of your home or dealership.', accent: false },
      { title: 'Scheduled Events', description: 'Browse upcoming auction events and register early for the best selection.', accent: false },
      { title: 'Curated Inventory', description: 'Access a handpicked selection of vehicles vetted for quality and value.', accent: false },
      { title: 'Market Pricing', description: 'Get real-time market insights and pricing data to make informed bids.', accent: true },
    ],
    stats: [
      { value: '500+', label: 'Vehicles Auctioned' },
      { value: '95%', label: 'Sell-Through Rate' },
      { value: '200+', label: 'Active Bidders' },
    ],
    ctaTitle: 'Ready to Start Bidding?',
    ctaDescription: 'Register your interest today and be the first to know when our auction platform goes live.',
  },
  scheduleDemo: {
    hero: {
      title: 'Schedule a Demo',
      subtitle: 'See Eagle Vision Edge In Action',
      description: 'Book a personalized walkthrough of our platform. Discover how we can transform your dealership operations.',
      backgroundImage: '',
    },
    benefits: [
      { title: 'Live Platform Walkthrough', description: 'See our platform in action with a guided tour of all features.', accent: false },
      { title: 'Custom Implementation Plan', description: 'Get a tailored roadmap for deploying our solutions at your dealership.', accent: true },
      { title: 'ROI Analysis', description: 'Understand the financial impact and expected returns for your business.', accent: false },
      { title: 'Expert Q&A', description: 'Get answers to your specific questions from our dealership technology experts.', accent: true },
    ],
  },
}
