import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronRight, Droplets, Ship, HardHat, Package } from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

const industries = [
  {
    id: 'oil-gas',
    name: 'Oil & Gas Offshore and Onshore Support',
    icon: <Droplets size={40} />,
    bgImage: '/assets/images/Offshore Rigger.jpeg',
    description: 'We supply highly specialized technical manpower and support vessels required for complex offshore oil platforms and onshore refineries. Safety and strict operational tolerances are our core focus.',
    stats: ['API Compliant', 'Offshore Riggers', 'HSE Certified']
  },
  {
    id: 'marine',
    name: 'Marine Operations',
    icon: <Ship size={40} />,
    bgImage: '/assets/images/Offshore Supply Ship.jpeg',
    description: 'Supporting port authorities, shipping companies, and salvage operations with diving support, stevedoring labor, and vessel chartering across the East Coast of India.',
    stats: ['Logistics', 'Maintenance']
  },
  {
    id: 'construction',
    name: 'Heavy Construction',
    icon: <HardHat size={40} />,
    bgImage: '/assets/images/Heavy Duty Crane.jpeg',
    description: 'From mega-projects to specialized industrial facility builds, we provide the backbone of labor and lifting equipment—cranes, forklifts, and certified operators.',
    stats: ['Large-scale Labor', 'Crane Operators', 'Site Management']
  },
  {
    id: 'logistics',
    name: 'Warehousing & Logistics',
    icon: <Package size={40} />,
    bgImage: '/assets/images/Technical Engineer at Work.png',
    description: 'End-to-end supply chain support. We handle material management, inventory storage, and dispatch teams ensuring resources reach the operation site precisely when needed.',
    stats: ['Inventory Tracking', 'Material Handling', 'Secure Storage']
  }
];

export function Industries() {
  return (
    <AnimatedPage className="bg-slate-light">
      {/* Page Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy/90 z-10"></div>
          <img 
            src="/assets/images/Hero Background.png" 
            alt="Industries" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4"
          >
            Industries We Serve
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-gray-300 font-medium"
          >
            <span>Home</span>
            <ChevronRight size={16} className="text-amber" />
            <span className="text-amber">Industries</span>
          </motion.div>
        </div>
      </section>

      {/* Industries Showcase - Stacked Parallax style */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {industries.map((industry, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={industry.id} className="relative">
                <FadeUp>
                  <div className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-stretch ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                    
                    {/* Image block */}
                    <div className={`relative h-[400px] lg:h-auto rounded-sm overflow-hidden shadow-2xl ${isEven ? 'order-1 lg:order-1' : 'order-1 lg:order-2'}`}>
                      <img 
                        src={industry.bgImage} 
                        alt={industry.name} 
                        className="w-full h-full object-cover absolute inset-0 hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent"></div>
                      <div className="absolute bottom-6 right-6 text-white/50 transform scale-150 origin-bottom-right">
                        {industry.icon}
                      </div>
                    </div>

                    {/* Content block */}
                    <div className={`flex flex-col justify-center py-8 ${isEven ? 'order-2 lg:order-2 lg:pl-8' : 'order-2 lg:order-1 lg:pr-8'}`}>
                      <div className="flex items-center gap-3 mb-6">
                        <span className="w-12 h-1 bg-amber block"></span>
                        <span className="text-amber font-heading font-semibold uppercase tracking-wider text-sm">Sector {index + 1}</span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-heading font-bold text-navy mb-6">
                        {industry.name}
                      </h2>
                      <p className="text-gray-600 text-lg leading-relaxed mb-8">
                        {industry.description}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 pt-8 mt-auto">
                        {industry.stats.map((stat, i) => (
                          <div key={i} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                            <span className="w-2 h-2 bg-cyan rounded-full mb-2"></span>
                            <span className="text-navy font-bold text-sm">{stat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </FadeUp>
              </div>
            );
          })}
        </div>
      </section>
    </AnimatedPage>
  );
}
