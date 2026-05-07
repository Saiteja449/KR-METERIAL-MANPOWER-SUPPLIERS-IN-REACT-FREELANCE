import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, PhoneCall, ChevronRight, Mail, MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Industries', path: '/industries' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed w-full top-0 z-50 transition-all duration-300 ease-in-out',
          isScrolled 
            ? 'bg-navy/95 backdrop-blur-md shadow-lg py-3' 
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo area */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/images/KRLOGO.jpeg" alt="KR Logo" className="h-10 w-auto rounded-sm" />
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white leading-[1.1] sm:leading-tight">
                  <span className="text-amber">KR</span> Material 
                  <span className="block sm:inline">& Manpower Supplies</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-cyan relative group py-2',
                      isActive ? 'text-amber' : 'text-gray-200'
                    )}
                  >
                    {link.name}
                    <span 
                      className={cn(
                        "absolute bottom-0 left-0 w-full h-[2px] bg-amber transform origin-left transition-transform duration-300",
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )} 
                    />
                  </Link>
                );
              })}
              
              <Link 
                to="/contact" 
                className="hidden lg:flex items-center gap-2 bg-amber hover:bg-amber-light text-navy font-bold px-5 py-2.5 rounded-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5"
              >
                <PhoneCall size={18} />
                <span>Get a Quote</span>
              </Link>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-amber transition-colors p-2"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-navy-dark pt-24 px-6 pb-6 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-xl font-heading font-medium tracking-wide border-b border-navy-light pb-4 flex justify-between items-center',
                    location.pathname === link.path ? 'text-amber' : 'text-gray-200'
                  )}
                >
                  {link.name}
                  <ChevronRight size={20} className={location.pathname === link.path ? 'text-amber' : 'text-gray-500'} />
                </Link>
              ))}
              <div className="pt-6">
                <Link 
                  to="/contact" 
                  className="flex items-center justify-center gap-2 w-full bg-amber text-navy font-bold px-6 py-4 rounded-sm transition-colors text-lg"
                >
                  <PhoneCall size={20} />
                  <span>Get a Quote</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
