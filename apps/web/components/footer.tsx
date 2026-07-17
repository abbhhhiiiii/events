"use client";

import Link from "next/link";
import Image from "next/image";
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Youtube, 
  Mail, 
  MapPin, 
  Phone, 
  ArrowRight 
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400 pt-20 pb-10 border-t border-white/10" id="contact">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          
          {/* 1. Brand & About */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block">
              <div className="relative w-[140px] h-[60px]">
                <Image
                  src="/sme-event.png"
                  alt="SME Events Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-500">
              India's premier platform for business events, innovative ideas, and meaningful networking. Shaping the future, together.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-300">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-semibold text-lg">Explore</h4>
            <ul className="flex flex-col gap-3">
              {["Upcoming Events", "Past Events", "Partner with us", "About Us", "FAQs & Help"].map((label) => (
                <li key={label}>
                  <Link href={`/#${label.toLowerCase().replace(/ /g, '-')}`} className="group flex items-center text-sm hover:text-orange-500 transition-colors">
                    <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-semibold text-lg">Contact Us</h4>
            <div className="flex flex-col gap-4 text-sm">
              <a href="mailto:events@smeevents.in" className="flex items-center gap-3 hover:text-orange-500 transition-colors">
                <Mail size={18} className="text-orange-500" />
                <span>events@smeevents.in</span>
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-3 hover:text-orange-500 transition-colors">
                <Phone size={18} className="text-orange-500" />
                <span>+91 98765 43210</span>
              </a>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">Bandra Kurla Complex (BKC),<br />Mumbai, Maharashtra</span>
              </div>
            </div>
          </div>

          {/* 4. Newsletter */}
          <div className="flex flex-col gap-6">
            <h4 className="text-white font-semibold text-lg">Stay Updated</h4>
            <p className="text-sm text-gray-500">Get early bird offers and event news.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-all"
                required
              />
              <button className="w-full bg-orange-500 text-white font-medium py-3 rounded-lg hover:bg-orange-600 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SME Events. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}