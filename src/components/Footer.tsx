import { Link } from 'react-router-dom'
import { Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">Eagle Vision Edge</h3>
            <p className="text-gray-300 text-sm">
              Premium auto dealership providing quality vehicles, flexible financing, and exceptional customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/inventory" className="hover:text-gold transition-smooth">Inventory</Link></li>
              <li><Link to="/financing" className="hover:text-gold transition-smooth">Financing</Link></li>
              <li><Link to="/rentals" className="hover:text-gold transition-smooth">Rentals</Link></li>
              <li><Link to="/about" className="hover:text-gold transition-smooth">About Us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>(305) 555-0100</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@eaglevision.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5" />
                <span>Miami, Florida 33101</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gold transition-smooth">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-gold transition-smooth">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-gold transition-smooth">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <p>&copy; 2024 Eagle Vision Edge. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link to="#" className="hover:text-gold transition-smooth">Privacy Policy</Link>
              <Link to="#" className="hover:text-gold transition-smooth">Terms of Service</Link>
              <Link to="/contact" className="hover:text-gold transition-smooth">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

