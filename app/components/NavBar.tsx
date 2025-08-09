"use client"
import { useState } from 'react';

import Link from 'next/link';
import {  usePathname } from 'next/navigation';
import { useMemo } from 'react';
//import User from './User';
import { Car, Menu, Phone, PhoneCall, X } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = useMemo(() => [
    { name: 'Home', href: '/', id: 'home' },
    { name: 'Fleet', href: '/fleet', id: 'fleet' },
    { name: 'Booking', href: '/booking', id: 'book' },
    { name: 'Services', href: '/services', id: 'services' },
   // { name: 'Contact', href: '/contact', id: 'contact' },
  ], []);

  // Function to get active section based on current pathname
  const getActiveSection = () => {
    const currentPath = pathname;
    const activeItem = navItems.find(item => item.href === currentPath);
    return activeItem ? activeItem.id : 'home';
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string,
    id: string
  ): void => {
    // Close mobile menu when clicking nav item
    setIsMobileMenuOpen(false);
    
    // If we're on the home page and clicking a section link, smooth scroll
    if (pathname === '/' && href === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
    // Otherwise, let Next.js handle the navigation normally
    // No need to prevent default - Link component will handle page navigation
  };

  return (
    <>
      {/* Sticky Navbar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                {/* Mobile Logo */}
                <div className="md:hidden">
                  <span className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg">
                    <Car/>
                  </span>
                </div>
                
                {/* Desktop Logo */}
                <div className="hidden md:flex items-center">
                  <span className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg mr-3">
                    <Car />
                  </span>
                  <span className="text-2xl font-bold text-primary">
                    Safari<span className="text-accent">Rides</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    getActiveSection() === item.id 
                      ? 'text-white bg-primary' 
                      : 'text-earth hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <Link 
                href="tel:+254111446888" 
                className="bg-accent hover:bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                <PhoneCall />
                <span>Call</span>
              </Link>
              <Link 
                href="https://wa.me/254111446888" 
                className="bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
              >
                 <FaWhatsapp/>
                <span>WhatsApp</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-earth hover:text-primary p-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Mobile Menu */}
          <div className="fixed top-20 left-0 right-0 bg-white shadow-xl z-50 md:hidden">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.id)}
                    className={`py-3 px-4 rounded-lg font-medium ${
                      getActiveSection() === item.id 
                        ? 'text-white bg-primary' 
                        : 'text-earth hover:text-primary'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile CTA Buttons */}
                <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                  <Link 
                    href="tel:+254700123456" 
                    className="bg-accent hover:bg-primary text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Phone />
                    <span>Call Us</span>
                  </Link>
                  <Link 
                    href="https://wa.me/254700123456" 
                    className="bg-primary hover:bg-accent text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaWhatsapp/>
                    <span>WhatsApp</span>
                  </Link>
                  
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;