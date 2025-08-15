import Link from 'next/link';
import { FaCar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-earth text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <FaCar className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">SafariRides</span>
                <p className="text-sm text-white/80">Kenya&lsquo;s Premier Car Hire</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              Your trusted partner for car hire in Kenya. Quality 4x4 vehicles, competitive prices, 
              and exceptional safari-ready service since 2012.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Facebook">
                <FaFacebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Instagram">
                <FaInstagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="Twitter">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/fleet" className="block text-white/80 hover:text-white transition-colors">
                Our Vehicle Fleet
              </Link>
              <Link href="/booking" className="block text-white/80 hover:text-white transition-colors">
                Book Now
              </Link>
              <Link href="/fleet" className="block text-white/80 hover:text-white transition-colors">
                Safari Packages
              </Link>
              <Link href="/#" className="block text-white/80 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/#" className="block text-white/80 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Vehicle Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Types</h3>
            <div className="space-y-2">
              <Link href="/fleet" className="block text-white/80 hover:text-white transition-colors">
                Safari 4x4 Vehicles
              </Link>
              <Link href="/fleet" className="block text-white/80 hover:text-white transition-colors">
                Economy Cars
              </Link>
              <Link href="/fleet" className="block text-white/80 hover:text-white transition-colors">
                Luxury Vehicles
              </Link>
              <Link href="/fleet" className="block text-white/80 hover:text-white transition-colors">
                Family SUVs
              </Link>
              <Link href="/fleet" className="block text-white/80 hover:text-white transition-colors">
                Minibuses & Vans
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="h-4 w-4 text-accent mt-1" />
                <span className="text-white/80 text-sm">
                  ABC Place, Westlands<br />
                  Nairobi, Kenya
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="h-4 w-4 text-accent" />
                <a href="tel:+254111446888" className="text-white/80 hover:text-white transition-colors text-sm">
                  +254 111 446 888
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="h-4 w-4 text-accent" />
                <a href="mailto:bookings@safarirides.co.ke" className="text-white/80 hover:text-white transition-colors text-sm">
                  bookings@safarirides.co.ke
                </a>
              </div>
              <Link 
                href="https://wa.me/254111446888" 
                className="inline-flex items-center justify-center bg-accent hover:bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium mt-2 transition-colors"
              >
                <FaWhatsapp className="h-4 w-4 mr-2" />
                WhatsApp Us
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} SafariRides Kenya. All rights reserved. | 
            Licensed by NTSA | Member of Kenya Tourism Federation
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;