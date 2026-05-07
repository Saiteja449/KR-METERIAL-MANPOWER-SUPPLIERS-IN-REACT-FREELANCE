import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { Phone } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function Layout() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-light relative overflow-x-hidden">
      <ScrollToTop />
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-amber origin-left z-[60]"
        style={{ scaleX }}
      />
      
      <Navbar />
      
      {/* 
        We use AnimatePresence in App.tsx to transition between pages, 
        here we just render the minimal main wrapper 
      */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* Global Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* Call Now Button */}
        <a 
          href="tel:+919666193543" 
          className="w-14 h-14 bg-amber text-navy rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(245,158,11,0.4)] transform hover:-translate-y-1 hover:scale-110 transition-all duration-300"
          title="Call Us Now"
        >
          <Phone className="w-6 h-6 animate-pulse" />
        </a>
        
        {/* WhatsApp Button */}
        <a 
          href="https://wa.me/919666193543" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] transform hover:-translate-y-1 hover:scale-110 transition-all duration-300"
          title="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.711.928 3.149.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.768-5.77zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.614-.087-.112-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964 1.003-3.588c-.608-1.065-.929-2.292-.929-3.544 0-4.05 3.295-7.345 7.345-7.345s7.345 3.295 7.345 7.345-3.295 7.345-7.345 7.345z"/></svg>
        </a>
      </div>
    </div>
  );
}
