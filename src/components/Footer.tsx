/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Award, Send } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [emailText, setEmailText] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailText.trim()) {
      setSuccess(true);
      setTimeout(() => {
        setEmailText('');
        setSuccess(false);
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#0F172A] text-gray-300 font-sans border-t border-slate-800">
      
      {/* 4 Pillars of Trust Badges */}
      <div className="border-b border-slate-850 bg-[#0B1120] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-slate-900 text-brand-accent rounded-xl border border-slate-800">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-white text-sm">100% Secure Checkout</h4>
                <p className="text-xs text-gray-400 mt-1">Stripe, SSLCommerz, and biometrically secured wallet gateways.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-slate-900 text-brand-accent rounded-xl border border-slate-800">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-white text-sm">Tracked Express Shipping</h4>
                <p className="text-xs text-gray-400 mt-1">Real-time dynamic location monitoring with instant courier dispatch.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-slate-900 text-brand-accent rounded-xl border border-slate-800">
                <RefreshCw size={24} />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-white text-sm">7-Day Hassle-Free Returns</h4>
                <p className="text-xs text-gray-400 mt-1">No-questions-asked quick replacement under Modex Care.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-slate-900 text-brand-accent rounded-xl border border-slate-800">
                <Award size={24} />
              </div>
              <div>
                <h4 className="font-heading font-semibold text-white text-sm">Primacy & Authenticity</h4>
                <p className="text-xs text-gray-400 mt-1">Every premium smart element carries certified brand warrants.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Sitemap Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Logo & Vision Block */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-9 h-9 bg-brand-accent text-slate-950 font-bold text-center rounded-lg flex items-center justify-center text-lg font-heading">
                M
              </div>
              <span className="font-heading font-extrabold text-white text-xl tracking-widest">MODEX</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Modex brings you premium global ecosystem hardware paired with meticulous lifestyle curation. Formulated for high efficiency, tailored for the progressive individual.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <MapPin size={16} className="text-brand-accent flex-shrink-0" />
                <span>Modex HQ: Road 11, Banani, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <Phone size={16} className="text-brand-accent flex-shrink-0" />
                <span>Sales: +880 1789-MODEX | Support: +91 9876-MODEX</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <Mail size={16} className="text-brand-accent flex-shrink-0" />
                <span>concierge@modex-premium.com</span>
              </div>
            </div>
          </div>

          {/* Quick links Columns */}
          <div>
            <h5 className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-5">Shop Experience</h5>
            <ul className="space-y-3 text-xs text-gray-400">
              <li><button onClick={() => onNavigate('category', { category: 'Audio' })} className="hover:text-brand-accent hover:underline transition-all">Audio Devices</button></li>
              <li><button onClick={() => onNavigate('category', { category: 'Wearables' })} className="hover:text-brand-accent hover:underline transition-all">Smart Wearables</button></li>
              <li><button onClick={() => onNavigate('category', { category: 'Home Theater' })} className="hover:text-brand-accent hover:underline transition-all">Projection Hubs</button></li>
              <li><button onClick={() => onNavigate('category', { category: 'Lifestyle' })} className="hover:text-brand-accent hover:underline transition-all">Lifestyle & Felt</button></li>
              <li><button onClick={() => onNavigate('shop')} className="hover:text-brand-accent hover:underline transition-all font-semibold text-gray-300">Discover All</button></li>
            </ul>
          </div>

          <div>
            <h5 className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-5">Support & Policies</h5>
            <ul className="space-y-3 text-xs text-gray-400">
              <li><button onClick={() => onNavigate('shipping-policy')} className="hover:text-brand-accent hover:underline transition-all">Shipping Guidelines</button></li>
              <li><button onClick={() => onNavigate('return-policy')} className="hover:text-brand-accent hover:underline transition-all">Check Returns</button></li>
              <li><button onClick={() => onNavigate('terms')} className="hover:text-brand-accent hover:underline transition-all">Terms of Conduct</button></li>
              <li><button onClick={() => onNavigate('privacy')} className="hover:text-brand-accent hover:underline transition-all">Privacy Safeguard</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-brand-accent hover:underline transition-all">Our Foundation</button></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h5 className="font-heading font-bold text-white text-xs uppercase tracking-widest mb-5">Editorial Newsletter</h5>
            <p className="text-xs text-gray-400 leading-relaxed mb-4">
              Subscribe to unlock seasonal private key vouchers and custom technology essays.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input 
                  type="email"
                  placeholder="name@personal.com"
                  required
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-brand-accent outline-none pr-10"
                />
                <button type="submit" className="absolute right-2.5 top-2 text-gray-400 hover:text-brand-accent transition-colors">
                  <Send size={14} />
                </button>
              </div>
              {success && (
                <span className="block text-[10px] text-success-gate bg-emerald-950/40 border border-emerald-900/30 px-3 py-1.5 rounded-lg font-medium animate-fade-in">
                  ✓ Scribed! Check your inbox for dynamic welcoming voucher.
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Dynamic Social Floating Elements Notification */}
        <div className="mt-14 pt-8 border-t border-slate-850 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-mono">
          <span>© {new Date().getFullYear()} MODEX Ltd. Modern Technology. Premium Lifestyle. All copyrights registered.</span>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <button onClick={() => onNavigate('contact')} className="hover:text-brand-accent hover:underline">Contact Concierge</button>
            <span>•</span>
            <a href="https://wa.me/8801789" target="_blank" rel="noreferrer" className="text-success-gate font-bold hover:underline">WhatsApp Support Live</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
