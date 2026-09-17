import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowRight, Facebook, Twitter, Linkedin, ShieldCheck, User, FilePlus } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-300 pt-20 pb-10 border-t border-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/assets/images/KRLOGO.jpeg" alt="KR Logo" className="h-10 w-auto rounded-sm border border-white/20" />
              <div className="flex flex-col">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white leading-tight whitespace-nowrap">
                  Material & Manpower
                </span>
                <span className="text-[10px] text-amber tracking-widest uppercase font-semibold">
                  Suppliers & Industrial Support
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Delivering trusted manpower & premium industrial support solutions for offshore, marine, and construction sectors in India and beyond.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-navy flex items-center justify-center hover:bg-amber hover:text-navy transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-navy flex items-center justify-center hover:bg-amber hover:text-navy transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-navy flex items-center justify-center hover:bg-amber hover:text-navy transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber block"></span>
              Quick Links
            </h3>
            <ul className="space-y-3 font-medium">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Our Services', path: '/services' },
                { name: 'Industries We Serve', path: '/industries' },
                { name: 'Careers & Vacancies', path: '/careers' },
                { name: 'Apply Online', path: '/apply' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-amber flex items-center gap-2 transition-colors group text-sm">
                    <ArrowRight size={14} className="text-cyan group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Candidate & Portal Access */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber block"></span>
              Candidate & Portals
            </h3>
            <ul className="space-y-3 font-medium">
              <li>
                <Link to="/apply" className="hover:text-amber flex items-center gap-2 transition-colors group text-sm">
                  <FilePlus size={14} className="text-amber" />
                  Apply for Deployment
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber flex items-center gap-2 transition-colors group text-sm">
                  <User size={14} className="text-cyan" />
                  Candidate Dashboard Login
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber flex items-center gap-2 transition-colors group text-sm">
                  <ShieldCheck size={14} className="text-amber-light" />
                  Staff / Admin Management
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-amber flex items-center gap-2 transition-colors group text-sm">
                  <ArrowRight size={14} className="text-cyan" />
                  Skilled Manpower Supply
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber block"></span>
              Contact Info
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-amber shrink-0 mt-1" size={20} />
                <span className="text-sm">Kakinada, Andhra Pradesh,<br />India - 533002</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-amber shrink-0" size={20} />
                <div className="flex flex-col text-sm">
                  <span>+91 9666193543</span>
                  <span>+91 9640195484</span>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-amber shrink-0" size={20} />
                <a href="mailto:info@kr1.in" className="text-sm hover:text-amber transition-colors">
                  info@kr1.in
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-navy-light flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} KR Material & Manpower Supplies. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link to="/login" className="hover:text-amber transition-colors">Candidate Login</Link>
            <Link to="/admin/login" className="hover:text-amber transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
