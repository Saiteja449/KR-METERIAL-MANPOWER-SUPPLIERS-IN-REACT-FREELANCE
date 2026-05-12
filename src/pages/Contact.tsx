import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, MapPin, Phone, Mail, Watch, Send } from 'lucide-react';
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

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: 'manpower', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', service: 'manpower', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  const handleChange = (e: any) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <AnimatedPage className="bg-slate-light">
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-navy/90 z-10 w-full h-full"></div>
        <img 
          src="/assets/images/Modern Industrial Office.jpeg" 
          alt="Contact" 
          className="absolute inset-0 z-0 w-full h-full object-cover"
        />
        <div className="relative z-20 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4"
          >
            Contact Us
          </motion.h1>
          <div className="flex items-center justify-center gap-2 text-gray-300 font-medium">
            <span>Home</span><ChevronRight size={16} className="text-amber" /><span className="text-amber">Contact</span>
          </div>
        </div>
      </section>

      <section className="py-24 relative -mt-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <FadeUp delay={0.1}>
                <div className="bg-white p-8 rounded-sm shadow-xl h-full border-b-4 border-amber">
                  <MapPin size={28} className="text-amber mb-4" />
                  <h3 className="font-heading font-bold text-navy text-xl">Head Office</h3>
                  <p className="text-gray-600 text-sm mt-2">KR Material & Manpower Supplies<br/>Kakinada, AP, India - 533002</p>
                </div>
              </FadeUp>
              <FadeUp delay={0.2}>
                <div className="bg-white p-8 rounded-sm shadow-xl h-full border-b-4 border-cyan-dark">
                  <Phone size={28} className="text-cyan-dark mb-4" />
                  <h3 className="font-heading font-bold text-navy text-xl">Contact Details</h3>
                  <p className="text-gray-600 text-sm mt-2">
                    <a href="tel:+919666193543">+91 9666193543</a><br/>
                    <a href="tel:+919640195484">+91 9640195484</a><br/>
                    <a href="mailto:info@kr1.in" className="text-navy font-semibold mt-2 block">info@kr1.in</a>
                  </p>
                </div>
              </FadeUp>
              <FadeUp delay={0.3}>
                <div className="bg-navy p-8 rounded-sm shadow-xl flex items-center gap-4">
                   <Watch className="text-amber" size={32} />
                   <div>
                    <h3 className="text-white font-heading font-bold">Hours</h3>
                    <p className="text-gray-400 text-sm">24/7 Support Available</p>
                   </div>
                </div>
              </FadeUp>
            </div>

            <div className="lg:col-span-2">
              <FadeUp delay={0.4}>
                <div className="bg-white p-8 md:p-12 rounded-sm shadow-xl">
                  <h2 className="text-3xl font-heading font-bold text-navy mb-6">Send an Inquiry</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-slate-light p-3 rounded-sm text-navy outline-none" placeholder="Full Name" />
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-slate-light p-3 rounded-sm text-navy outline-none" placeholder="Email Address" />
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-slate-light p-3 rounded-sm text-navy outline-none" placeholder="Phone Number" />
                      <select name="service" value={formData.service} onChange={handleChange} className="w-full bg-slate-light p-3 rounded-sm text-navy outline-none">
                        <option value="manpower">Manpower Supply</option>
                        <option value="marine">Marine Support</option>
                        <option value="equipment">Equipment Support</option>
                        <option value="oil-gas">Oil and Gas Support</option>
                        <option value="other">Other Inquiry</option>
                        <option value="chemical">Chemical</option>
                      </select>
                    </div>
                    <textarea name="message" required value={formData.message} onChange={handleChange} rows={5} className="w-full bg-slate-light px-4 py-3 rounded-sm text-navy outline-none" placeholder="Message / Requirements"></textarea>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-green-600">{submitStatus === 'success' ? 'Sent successfully!' : ''}</span>
                      <button type="submit" disabled={isSubmitting} className="bg-navy text-white px-8 py-3 rounded-sm flex items-center gap-2">
                        {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
                      </button>
                    </div>
                  </form>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white h-[400px]">
         <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15259.988085449557!2d82.23594895000001!3d16.9620542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a38284b1a4cb407%3A0xea21be147e81cc56!2sKakinada%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Office Location Map"></iframe>
      </section>

    </AnimatedPage>
  );
}
