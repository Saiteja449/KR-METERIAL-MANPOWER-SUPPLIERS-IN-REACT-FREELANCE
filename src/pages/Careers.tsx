import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Users, Heart, Target, Sparkles } from 'lucide-react';
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

export function Careers() {
  return (
    <AnimatedPage className="bg-slate-light">
      {/* Page Header */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-navy/90 z-10"></div>
          <img 
            src="/assets/images/Skilled Industrial Team.png" 
            alt="Careers at KR" 
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
            Join Our Team
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center gap-2 text-gray-300 font-medium"
          >
            <span>Home</span>
            <ChevronRight size={16} className="text-amber" />
            <span className="text-amber">Careers</span>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 md:p-16 rounded-sm shadow-xl border-t-4 border-amber">
            <FadeUp>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-10">
                Careers
              </h2>
            </FadeUp>

            <div className="space-y-8">
              <FadeUp delay={0.1}>
                <p className="text-xl md:text-2xl font-heading font-bold text-navy leading-tight">
                  As a service business, it is our people, their capabilities and skills that set us apart from our competitors.
                </p>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We strive to create an environment of diversity and inclusivity, where our people can thrive in a culture irrespective of ethnicity, gender, sexuality, background and approach. It is a culture that values and celebrates our individual differences as much as our common beliefs.
                </p>
              </FadeUp>

              {/* Cultural Values / Why Join Us */}
              <div className="grid sm:grid-cols-2 gap-8 pt-12 mt-12 border-t border-gray-100">
                <FadeUp delay={0.3}>
                  <div className="flex gap-4">
                    <div className="bg-amber/10 p-3 rounded-full text-amber shrink-0 h-fit">
                      <Heart size={24} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-navy text-lg mb-2">Inclusive Culture</h4>
                      <p className="text-gray-500 text-sm">We value every individual and foster a workspace where everyone feels they belong.</p>
                    </div>
                  </div>
                </FadeUp>
                <FadeUp delay={0.4}>
                  <div className="flex gap-4">
                    <div className="bg-cyan/10 p-3 rounded-full text-cyan-dark shrink-0 h-fit">
                      <Target size={24} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-navy text-lg mb-2">Growth Focus</h4>
                      <p className="text-gray-500 text-sm">Empowering our people with the skills and opportunities to reach their full potential.</p>
                    </div>
                  </div>
                </FadeUp>
                <FadeUp delay={0.5}>
                  <div className="flex gap-4">
                    <div className="bg-amber/10 p-3 rounded-full text-amber shrink-0 h-fit">
                      <Users size={24} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-navy text-lg mb-2">Expert Team</h4>
                      <p className="text-gray-500 text-sm">Work alongside industry veterans and skilled professionals in diverse sectors.</p>
                    </div>
                  </div>
                </FadeUp>
                <FadeUp delay={0.6}>
                  <div className="flex gap-4">
                    <div className="bg-cyan/10 p-3 rounded-full text-cyan-dark shrink-0 h-fit">
                      <Sparkles size={24} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-navy text-lg mb-2">Innovation</h4>
                      <p className="text-gray-500 text-sm">We embrace new ideas and approaches to solve complex industrial challenges.</p>
                    </div>
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>

          {/* <FadeUp delay={0.7}>
            <div className="mt-16 bg-navy p-10 rounded-sm shadow-2xl text-center">
              <h3 className="text-2xl font-heading font-bold text-white mb-4">Want to work with us?</h3>
              <p className="text-gray-300 mb-8 max-w-xl mx-auto">
                We are always looking for talented individuals to join our growing team. Send your resume and a brief cover letter to our HR department.
              </p>
              <a 
                href="mailto:kneelapalli@gmail.com" 
                className="inline-flex bg-amber hover:bg-amber-light text-navy font-bold px-8 py-4 rounded-sm transition-all items-center justify-center gap-2 text-lg shadow-xl"
              >
                Apply Now
                <ChevronRight size={24} />
              </a>
            </div>
          </FadeUp> */}
        </div>
      </section>
    </AnimatedPage>
  );
}
