import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ArrowRight, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-navy-dark text-gray-300 pt-20 pb-10 border-t border-navy-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/assets/images/KRLOGO.jpeg" alt="KR Logo" className="h-10 w-auto rounded-sm" />
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl tracking-tight text-white leading-tight">
                  <span className="text-amber">KR</span> Material
                </span>
                <span className="text-gray-400 text-[8px] uppercase tracking-[0.1em] font-semibold block leading-tight">
                  & Manpower Supplies
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
                { name: 'Careers', path: '#' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-amber flex items-center gap-2 transition-colors group">
                    <ArrowRight size={14} className="text-cyan group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-heading font-semibold text-lg mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-amber block"></span>
              Core Services
            </h3>
            <ul className="space-y-3 font-medium">
              {[
                'Skilled Manpower Supply',
                'Marine Support Services',
                'Diving Support',
                'Equipment Repair',
                'Warehouse Management'
              ].map((service) => (
                <li key={service}>
                  <Link to="/services" className="hover:text-amber flex items-center gap-2 transition-colors group">
                    <ArrowRight size={14} className="text-cyan group-hover:translate-x-1 transition-transform" />
                    {service}
                  </Link>
                </li>
              ))}
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
                <span className="text-sm">Kakinada, Andhra Pradesh,<br />India - 533001</span>
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
                <a href="mailto:kneelapalli@gmail.com" className="text-sm hover:text-amber transition-colors">
                  kneelapalli@gmail.com
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
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
