import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Droplets, Users, Compass, ChevronRight } from 'lucide-react';
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

export function About() {
  return (
    <AnimatedPage className="bg-white">
      {/* Page Header */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy-dark/80 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=2000" 
            alt="About Us Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-20 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-4"
          >
            About Our Company
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-gray-300 font-medium"
          >
            <span>Home</span>
            <ChevronRight size={16} className="text-amber" />
            <span className="text-amber">About Us</span>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 bg-slate-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <div className="relative">
                <div className="rounded-sm overflow-hidden shadow-2xl relative z-10 border-l-4 border-amber">
                  <img 
                    src="https://images.unsplash.com/photo-1581092580497-e0d23cbca152?auto=format&fit=crop&q=80&w=1000" 
                    alt="Industrial Operations" 
                    className="w-full h-[600px] object-cover"
                  />
                </div>
                {/* Decorative Box */}
                <div className="absolute -bottom-10 -right-10 w-3/4 h-3/4 border-4 border-navy/10 z-0 hidden lg:block"></div>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.2}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-12 h-1 bg-amber block"></span>
                <span className="text-navy font-heading font-semibold uppercase tracking-wider text-sm">Company Overview</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy mb-6">
                Leading the Industry in Manpower & Corporate Support Solutions
              </h2>
              <div className="space-y-4 text-gray-600 text-lg leading-relaxed mb-8">
                <p>
                  Established in Kakinada, Andhra Pradesh, <strong>KR Material & Manpower Supplies</strong> has grown into a formidable backbone for the region's industrial sector. We specialize in providing comprehensive support services that allow our clients to focus on their core operations.
                </p>
                <p>
                  Whether it is supplying highly skilled riggers to an offshore platform, managing complex warehouse logistics, or providing diving support vessels, our commitment to excellence remains unwavering. We don't just supply manpower; we provide operational assurance.
                </p>
              </div>

              {/* Core Values Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
                {[
                  { icon: <ShieldCheck />, title: 'Integrity', text: 'Uncompromising moral principles in every contract.' },
                  { icon: <Target />, title: 'Precision', text: 'Exact matching of skills to industrial requirements.' },
                  { icon: <Users />, title: 'People First', text: 'Investing in the welfare and training of our workforce.' },
                  { icon: <Compass />, title: 'Reliability', text: 'Available 24/7 for critical marine and offshore support.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 hover:border-amber/50 transition-colors group">
                    <div className="w-12 h-12 bg-slate-light text-cyan-dark rounded-sm flex items-center justify-center mb-4 group-hover:bg-cyan-dark group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <h4 className="font-heading font-bold text-navy mb-2">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.text}</p>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-navy-light transform skew-x-12 translate-x-32 hidden lg:block border-l-4 border-amber"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <FadeUp>
              <div className="bg-white/5 backdrop-blur-sm p-10 rounded-sm border border-white/10 hover:border-amber/30 transition-colors h-full">
                <h3 className="text-3xl font-heading font-bold text-white mb-6 flex items-center gap-4">
                  <span className="w-12 h-12 bg-amber text-navy rounded-sm flex items-center justify-center text-xl">V</span>
                  Our Vision
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To be the universally recognized standard of excellence for industrial support and manpower services across India's maritime and energy sectors. We envision a future where our robust workforce empowers global energy transitions and infrastructure development safely and efficiently.
                </p>
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="bg-white/5 backdrop-blur-sm p-10 rounded-sm border border-white/10 hover:border-cyan/30 transition-colors h-full">
                <h3 className="text-3xl font-heading font-bold text-white mb-6 flex items-center gap-4">
                  <span className="w-12 h-12 bg-cyan text-navy rounded-sm flex items-center justify-center text-xl">M</span>
                  Our Mission
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  To deliver rapid, reliable, and rigorously trained personnel and operational support to the Oil & Gas, Marine, and Construction industries, ensuring our clients achieve maximum productivity with zero safety incidents.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-navy mb-4">Leadership Excellence</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Guided by deep industry knowledge and unwavering commitment.</p>
            </FadeUp>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <FadeUp delay={0.2}>
              <div className="bg-slate-light p-8 md:p-12 rounded-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber rounded-bl-full opacity-10 group-hover:scale-110 transition-transform"></div>
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 bg-navy rounded-sm overflow-hidden flex items-center justify-center relative shadow-lg">
                    {/* Placeholder for standard professional portrait */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-navy to-navy-light"></div>
                    <span className="text-4xl text-amber font-heading font-bold relative z-10">KN</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-navy mb-1">Mr. Kamaraju Neelapalli</h3>
                    <p className="text-cyan-dark font-semibold text-sm uppercase tracking-wider mb-6">Managing Director</p>
                    <p className="text-gray-600 leading-relaxed">
                      With extensive experience in industrial operations and manpower deployment, Mr. Neelapalli leads the strategic direction of KR Material & Manpower Supplies. His dedication to client satisfaction and worker safety has established the company as a preferred vendor for major offshore and marine projects operating out of the East Coast of India.
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
