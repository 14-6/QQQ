'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Megaphone, Globe } from 'lucide-react';
import AdBookingForm from '../AdBookingForm';

interface NavbarProps {
  lang?: 'ar' | 'en';
  onToggleLang?: () => void;
  onOpenAdModal?: () => void;
}

export default function Navbar({ lang = 'ar', onToggleLang, onOpenAdModal }: NavbarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
     {/* الشعار أو اسم المجموعة */}
        <div className="flex items-center gap-3">
          <Link href="/" className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/25 to-yellow-300/25 rounded-xl blur-sm opacity-40 group-hover:opacity-75 transition-all duration-500"></div>
            <div className="relative px-3.5 py-1.2 rounded-xl border border-amber-400/50 bg-neutral-900/90 backdrop-blur-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
              <span className="text-sm sm:text-base font-black tracking-[0.22em] text-amber-400 drop-shadow-[0_2px_6px_rgba(251,191,36,0.3)]">QQQ</span>
            </div>
          </Link>
        </div>

        {/* روابط التنقل الرئيسية */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-full border border-neutral-800/80 shadow-inner">
          <Link
            href="/"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isActive('/') 
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md' 
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            {lang === 'ar' ? 'الرئيسية' : 'Home'}
          </Link>

          <Link
            href="/about"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isActive('/about') 
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md' 
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            {lang === 'ar' ? 'من نحن' : 'About Us'}
          </Link>

          <Link
            href="/brands"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isActive('/brands') 
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md' 
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            {lang === 'ar' ? 'البراندات والمشاريع' : 'Brands'}
          </Link>

          <Link
            href="/contact"
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              isActive('/contact') 
                ? 'bg-amber-500 text-neutral-950 font-semibold shadow-md' 
                : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            {lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}
          </Link>
        </nav>

        {/* أزرار الإجراءات (حجز الإعلان وتغيير اللغة) */}
            <div className="flex items-center gap-3">
            {/* مكون حجز الإعلان المربوط بـ Supabase والأدمن */}
            <AdBookingForm lang={lang === 'en' ? 'en' : 'ar'} />

            {/* زر تغيير اللغة */}
            <button
                onClick={onToggleLang}
                className="relative group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-400/50 bg-neutral-900/90 backdrop-blur-xl shadow-md hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-300"
                title="تغيير اللغة / Change Language"
            >
                <Globe className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 font-bold text-xs tracking-wider">
                {lang === 'ar' ? 'EN' : 'عربي'}
                </span>
            </button>
            </div>

      </div>
    </header>
  );
}