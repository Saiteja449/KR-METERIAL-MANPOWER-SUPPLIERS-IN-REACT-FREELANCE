import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ShieldCheck, Anchor, HardHat, Building2, ChevronRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
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

const Bubbles = () => {
  return (
    <div className="absolute inset-0 z-[15] overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => {
        const size = Math.random() * 80 + 20;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-20%',
              width: size,
              height: size,
            }}
            animate={{
              y: ['0vh', '-120vh'],
              x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
              rotate: [0, 180, 360],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};

export function Home() {
  return (
    <AnimatedPage className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[100dvh] min-h-[700px] flex items-center justify-start overflow-hidden bg-navy-dark">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <motion.img 
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 25, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            src="/assets/images/Hero Background.png" 
            alt="Industrial Operations Background" 
            className="w-full h-full object-cover origin-center"
          />
          {/* Gradient Decals */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/90 to-transparent z-10 w-full sm:w-3/4 lg:w-2/3"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-transparent to-transparent z-10 opacity-90"></div>
          <div className="absolute inset-0 bg-navy-dark/40 sm:hidden z-10"></div>
          <Bubbles />
        </div>

        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-16 sm:pt-20 sm:pb-0 flex flex-col items-start justify-center min-h-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden md:inline-flex items-center gap-3 px-4 py-2 rounded-sm border border-amber/30 bg-navy/50 backdrop-blur-md mb-8 shadow-xl"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber animate-pulse"></span>
            <span className="text-amber-light text-sm font-semibold tracking-widest uppercase">Trusted Industrial Partner</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-[1.2] mb-6 max-w-4xl tracking-tight"
          >
            Delivering Trusted <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-amber-light inline-block min-h-[1.2em]">
              <TypeAnimation
                sequence={[
                  'Manpower',
                  2000,
                  'Marine Support',
                  2000,
                  'Skilled Talent',
                  2000,
                  'Logistics',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
              />
            </span> <br className="hidden sm:block" />
            Solutions
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed font-medium"
          >
            Empowering the Oil & Gas, Marine, and Construction sectors with highly skilled personnel and reliable operational support.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link 
              to="/services" 
              className="bg-amber hover:bg-amber-light text-navy font-bold px-8 py-4 rounded-sm transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] transform hover:-translate-y-1 w-full sm:w-auto text-lg"
            >
              Explore Services
              <ArrowRight size={22} className="ml-1" />
            </Link>
            <Link 
              to="/contact" 
              className="bg-navy/50 backdrop-blur-md border border-white/20 hover:bg-white text-white hover:text-navy font-bold px-8 py-4 rounded-sm transition-all flex items-center justify-center transform hover:-translate-y-1 w-full sm:w-auto text-lg"
            >
              Contact Us
            </Link>
          </motion.div>

          {/* Quick Stats right in Hero */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-8 sm:gap-16 w-full max-w-3xl"
          >
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-bold text-white mb-1">10+</div>
              <div className="text-amber text-sm font-semibold uppercase tracking-wider">Years Exp</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-heading font-bold text-white mb-1">500+</div>
              <div className="text-amber text-sm font-semibold uppercase tracking-wider">Professionals</div>
            </div>
            <div className="col-span-2 md:col-span-1">
              <div className="text-3xl sm:text-4xl font-heading font-bold text-white mb-1">100%</div>
              <div className="text-amber text-sm font-semibold uppercase tracking-wider">Safety Record</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Overview */}
      <section className="py-24 bg-slate-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeUp>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-12 h-1 bg-amber block"></span>
                  <span className="text-navy font-heading font-semibold uppercase tracking-wider text-sm">Who We Are</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-navy mb-6 leading-tight">
                  Driving Industrial Excellence
                </h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  Based in Kakinada, Andhra Pradesh, KR Material & Manpower Supplies is a premier provider of industrial support services. We bridge the gap between global industrial demands and highly qualified operational talent.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Highly Skilled & Certified Workforce',
                    'Comprehensive Marine & Diving Support',
                    'Rigorous Safety & Quality Standards',
                    'End-to-End Material Handling Solutions'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="text-amber shrink-0 mt-1" size={20} />
                      <span className="text-slate-dark font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/about" className="inline-flex items-center gap-2 text-cyan-dark font-bold hover:text-navy transition-colors group">
                  Discover Our Company
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </FadeUp>
            </div>
            <div className="relative">
              <FadeUp delay={0.2}>
                <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
                  <img 
                    src="/assets/images/Skilled Industrial Team.png" 
                    alt="Industrial Facility" 
                    className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-amber/10 rounded-full blur-3xl z-0"></div>
                <div className="absolute -top-8 -right-8 w-48 h-48 bg-cyan/10 rounded-full blur-3xl z-0"></div>
                
                <div className="absolute -bottom-10 -right-6 bg-white p-6 rounded-sm shadow-xl z-20 border-l-4 border-amber">
                  <div className="flex items-center gap-4">
                    <div className="bg-navy p-3 rounded-full text-amber">
                      <ShieldCheck size={32} />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-3xl text-navy">Zero</p>
                      <p className="text-gray-500 font-medium text-sm">Compromise on Safety</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-navy relative overflow-hidden">
        {/* Background Map/Texture */}
        <div className="absolute inset-0 opacity-[0.03]">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeUp>
              <span className="text-amber font-heading font-semibold uppercase tracking-wider text-sm flex items-center justify-center gap-2 mb-4">
                <span className="w-8 h-[2px] bg-amber block"></span>
                Our Expertise
                <span className="w-8 h-[2px] bg-amber block"></span>
              </span>
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
                Comprehensive Industrial Services
              </h2>
            </FadeUp>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Manpower Supply',
                desc: 'Specialized provision of Skilled, Semi-Skilled, and Unskilled personnel for diverse industrial needs.',
                icon: <Users size={32} />,
                img: '/assets/images/Technical Engineer at Work.png'
              },
              {
                title: 'Marine Support',
                desc: 'Comprehensive marine logistics including chartering of DSV and Supply Vessels.',
                icon: <Anchor size={32} />,
                img: '/assets/images/Diving Support Vessel.jpeg'
              },
              {
                title: 'Construction & Equipment',
                desc: 'Heavy equipment logistics, crane & forklift hiring, and repair & maintenance.',
                icon: <HardHat size={32} />,
                img: '/assets/images/Heavy Duty Crane.jpeg'
              }
            ].map((service, i) => (
              <React.Fragment key={i}>
                <FadeUp delay={i * 0.1}>
                  <div className="group relative h-[400px] overflow-hidden rounded-sm cursor-pointer">
                  <div className="absolute inset-0">
                    <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/80 to-transparent"></div>
                  
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="w-14 h-14 bg-amber text-navy rounded-sm flex items-center justify-center mb-6 shadow-lg transform group-hover:-translate-y-2 transition-transform">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 font-medium mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-3">
                      {service.desc}
                    </p>
                    <Link to="/services" className="text-amber flex items-center gap-2 font-bold group/link inline-block w-fit">
                      Read More
                      <ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </FadeUp>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Parallax effect simulation */}
      <section className="py-20 relative overflow-hidden bg-navy-dark">
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/images/Offshore Supply Ship.jpeg" 
            alt="Stats Background" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '24/7', label: 'Operational Support' },
              { num: '100%', label: 'Client Retention' },
              { num: 'ISO', label: 'Certified Quality' },
              { num: 'Zero', label: 'Lost Time Incidents' }
            ].map((stat, i) => (
              <React.Fragment key={i}>
                <FadeUp delay={i * 0.1}>
                  <div className="text-center p-6 border border-white/10 bg-white/5 backdrop-blur-sm rounded-sm hover:border-amber/50 transition-colors">
                  <div className="text-4xl md:text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber to-amber-light mb-2">
                    {stat.num}
                  </div>
                  <div className="text-white font-medium uppercase tracking-wider text-sm flex flex-col items-center justify-center h-10">
                    {stat.label}
                  </div>
                </div>
              </FadeUp>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeUp>
            <h2 className="text-4xl font-heading font-bold text-navy mb-6">
              Ready to Upgrade Your Operations?
            </h2>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Partner with KR Material & Manpower Supplies for unparalleled industrial support. Reach out to our experts today for a customized solution.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex bg-navy hover:bg-navy-light text-white font-bold px-8 py-4 rounded-sm transition-all items-center justify-center gap-2 text-lg shadow-xl"
            >
              Get in Touch Now
              <ChevronRight size={24} className="text-amber" />
            </Link>
          </FadeUp>
        </div>
      </section>
    </AnimatedPage>
  );
}
