import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Anchor, HardHat, Warehouse, Users, Settings, Truck } from 'lucide-react';
import { AnimatedPage } from '../components/layout/AnimatedPage';
import { cn } from '../lib/utils';

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

const servicesList = [
  {
    id: 'manpower',
    title: 'Skilled / Semi-Skilled / Unskilled Manpower',
    icon: <Users size={28} />,
    image: 'https://images.unsplash.com/photo-1542621323-22ea6aab1479?auto=format&fit=crop&q=80&w=800',
    description: 'We provide specialized and thoroughly vetted personnel tailored to your project requirements. From highly technical rig operators to dedicated general laborers, our workforce is trained in strict safety protocols and industry standards.'
  },
  {
    id: 'marine',
    title: 'Marine Support Services',
    icon: <Anchor size={28} />,
    image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&q=80&w=800',
    description: 'Comprehensive logistics and support for maritime operations. We manage port operations, vessel clearings, and ensure seamless transfer of personnel and equipment between onshore and offshore facilities.'
  },
  {
    id: 'diving',
    title: 'Diving Support & Vessel Chartering',
    icon: <Anchor size={28} />,
    image: 'https://images.unsplash.com/photo-1516283250450-17438ec9ef5f?auto=format&fit=crop&q=80&w=800',
    description: 'We facilitate the chartering of Diving Support Vessels (DSV), Supply Vessels, and specialized equipment required for subsea operations, maintenance, and underwater inspections.'
  },
  {
    id: 'equipment',
    title: 'Crane & Forklift Hiring',
    icon: <HardHat size={28} />,
    image: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800',
    description: 'Heavy lifting solutions back by modern, well-maintained equipment. We provide certified cranes, forklifts, and heavy machinery along with licensed operators for safe and efficient material handling.'
  },
  {
    id: 'warehouse',
    title: 'Warehouse Management Solutions',
    icon: <Warehouse size={28} />,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8ed7c159ec?auto=format&fit=crop&q=80&w=800',
    description: 'Turnkey storage and inventory management. Our warehouse solutions are optimized for the dynamic needs of the offshore and construction sectors, ensuring materials are securely stored and readily available.'
  },
  {
    id: 'repair',
    title: 'Equipment Repair & Maintenance',
    icon: <Settings size={28} />,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbca152?auto=format&fit=crop&q=80&w=800',
    description: 'Minimizing downtime with expert maintenance services. Our technician teams are equipped to handle preventive maintenance and emergency repairs for a wide array of industrial machinery.'
  }
];

export function Services() {
  const [activeService, setActiveService] = useState(servicesList[0].id);

  return (
    <AnimatedPage className="bg-slate-light">
      {/* Page Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy/90 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000" 
            alt="Services" 
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
            Our Services
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-gray-300 font-medium"
          >
            <span>Home</span>
            <ChevronRight size={16} className="text-amber" />
            <span className="text-amber">Services</span>
          </motion.div>
        </div>
      </section>

      {/* Interactive Services Showcase */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 space-y-2">
              <FadeUp>
                <h3 className="text-2xl font-heading font-bold text-navy mb-8 pl-4 border-l-4 border-amber">
                  What We Offer
                </h3>
              </FadeUp>
              <div className="flex flex-col gap-2">
                {servicesList.map((service, i) => (
                  <React.Fragment key={service.id}>
                    <FadeUp delay={i * 0.05}>
                      <button
                      onClick={() => setActiveService(service.id)}
                      className={cn(
                        "w-full text-left px-6 py-4 rounded-sm flex items-center justify-between transition-all duration-300 border-l-4 font-heading font-semibold",
                        activeService === service.id 
                          ? "bg-white text-navy border-amber shadow-md"
                          : "bg-transparent text-gray-500 border-transparent hover:bg-white/50 hover:text-navy"
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className={activeService === service.id ? "text-cyan-dark" : ""}>
                          {service.icon}
                        </span>
                        {service.title}
                      </span>
                      {activeService === service.id && (
                        <ChevronRight size={20} className="text-amber" />
                      )}
                    </button>
                    </FadeUp>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Content Display */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-sm shadow-xl overflow-hidden min-h-[500px] relative">
                <AnimatePresence mode="wait">
                  {servicesList.map((service) => (
                    service.id === activeService && (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="h-full flex flex-col"
                      >
                        <div className="h-64 sm:h-80 relative overflow-hidden">
                          <img 
                            src={service.image} 
                            alt={service.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent"></div>
                          <div className="absolute bottom-6 left-6 text-white flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber rounded-sm flex items-center justify-center text-navy shadow-lg">
                              {service.icon}
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-heading font-bold">{service.title}</h2>
                          </div>
                        </div>
                        <div className="p-8 sm:p-10 flex-grow flex flex-col justify-center">
                          <p className="text-lg text-gray-600 leading-relaxed">
                            {service.description}
                          </p>
                          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-cyan-dark font-medium uppercase tracking-wider text-sm flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-amber inline-block"></span>
                              Available 24/7
                            </span>
                            <button className="bg-navy hover:bg-navy-light text-white px-6 py-2 rounded-sm text-sm font-semibold transition-colors">
                              Request Service
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </section>
    </AnimatedPage>
  );
}
