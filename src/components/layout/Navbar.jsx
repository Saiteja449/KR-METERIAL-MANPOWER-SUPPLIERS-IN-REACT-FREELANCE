import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronRight, User, LogOut, ShieldCheck, FilePlus } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { useAuth } from '../../context/AuthContext.jsx';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

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
    { name: 'Careers', path: '/careers' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header
        className={cn(
          'fixed w-full top-0 z-50 transition-all duration-300 ease-in-out',
          isScrolled 
            ? 'bg-navy/95 backdrop-blur-md shadow-lg py-3' 
            : 'bg-navy/80 backdrop-blur-xs py-4 sm:py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo area */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/assets/images/KRLOGO.jpeg" alt="KR Logo" className="h-10 w-auto rounded-sm border border-white/20" />
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-base sm:text-xl tracking-tight text-white leading-[1.1] sm:leading-tight">
                  Material & Manpower
                </span>
                <span className="text-[10px] text-amber tracking-widest uppercase font-semibold">
                  Suppliers & Industrial Support
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'text-xs lg:text-sm font-semibold tracking-wide transition-colors hover:text-cyan relative group py-2',
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

              {/* Apply / Portal Action Buttons */}
              <div className="flex items-center gap-2.5">
                <Link
                  to="/apply"
                  className="inline-flex items-center gap-1.5 bg-amber hover:bg-amber-light text-navy font-extrabold px-3.5 py-2 rounded-sm text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transform hover:-translate-y-0.5"
                >
                  <FilePlus size={14} />
                  <span>Apply Now</span>
                </Link>

                {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <Link
                      to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                      className="inline-flex items-center gap-1.5 bg-navy-light hover:bg-navy text-cyan font-bold px-3.5 py-2 rounded-sm text-xs border border-cyan/30 transition-colors"
                    >
                      {isAdmin ? <ShieldCheck size={14} /> : <User size={14} />}
                      <span>{isAdmin ? 'Admin Panel' : 'Dashboard'}</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="p-2 text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Logout"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1 text-gray-200 hover:text-amber font-semibold text-xs py-2 px-2.5 transition-colors border border-white/20 hover:border-amber/50 rounded-sm"
                      title="Candidate Portal Login"
                    >
                      <User size={13} />
                      <span>Candidate Login</span>
                    </Link>

                    <Link
                      to="/admin/login"
                      className="inline-flex items-center gap-1 text-amber-light hover:text-amber bg-navy-light/80 hover:bg-navy-light font-bold text-xs py-2 px-2.5 transition-colors border border-amber/30 rounded-sm"
                      title="Administrative Staff Login"
                    >
                      <ShieldCheck size={13} className="text-amber" />
                      <span>Login as Admin</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                to="/apply"
                className="bg-amber text-navy font-bold px-3 py-1.5 rounded-sm text-xs"
              >
                Apply
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-amber transition-colors p-2 cursor-pointer"
              >
                {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
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
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-lg font-heading font-medium tracking-wide border-b border-navy-light pb-3 flex justify-between items-center',
                    location.pathname === link.path ? 'text-amber' : 'text-gray-200'
                  )}
                >
                  {link.name}
                  <ChevronRight size={18} className={location.pathname === link.path ? 'text-amber' : 'text-gray-500'} />
                </Link>
              ))}

              <div className="pt-4 space-y-3">
                <Link 
                  to="/apply" 
                  className="flex items-center justify-center gap-2 w-full bg-amber text-navy font-bold px-6 py-3.5 rounded-sm transition-colors text-base"
                >
                  <FilePlus size={18} />
                  <span>Apply for Job / Deployment</span>
                </Link>

                {isAuthenticated ? (
                  <>
                    <Link
                      to={isAdmin ? '/admin/dashboard' : '/dashboard'}
                      className="flex items-center justify-center gap-2 w-full bg-navy-light text-cyan font-bold px-6 py-3 rounded-sm text-sm border border-cyan/30"
                    >
                      {isAdmin ? <ShieldCheck size={16} /> : <User size={16} />}
                      <span>{isAdmin ? 'Admin Portal' : 'My Dashboard'}</span>
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center justify-center gap-2 w-full bg-rose-950/40 text-rose-300 font-bold px-6 py-2.5 rounded-sm text-xs cursor-pointer"
                    >
                      <LogOut size={14} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      className="flex items-center justify-center gap-1.5 bg-navy-light text-gray-200 font-semibold py-2.5 rounded-sm text-xs"
                    >
                      <User size={14} />
                      <span>Candidate Login</span>
                    </Link>
                    <Link
                      to="/admin/login"
                      className="flex items-center justify-center gap-1.5 bg-navy-light text-amber font-semibold py-2.5 rounded-sm text-xs"
                    >
                      <ShieldCheck size={14} />
                      <span>Admin Login</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
